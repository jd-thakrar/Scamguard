import pandas as pd
from datasets import Dataset
from transformers import AutoTokenizer, AutoModelForSequenceClassification, TrainingArguments, Trainer
import numpy as np
import evaluate

# === 1. Load dataset (change path to your Kaggle CSV) ===
df = pd.read_csv("spam.csv", encoding="latin-1")   # Example: SMS Spam dataset
df = df[["v1", "v2"]]
df.columns = ["label", "text"]

# Convert labels to 0/1
df["label"] = df["label"].map({"ham": 0, "spam": 1})

dataset = Dataset.from_pandas(df)

# === 2. Tokenize ===
model_name = "distilbert-base-uncased"
tokenizer = AutoTokenizer.from_pretrained(model_name)

def preprocess(examples):
    return tokenizer(examples["text"], truncation=True, padding="max_length", max_length=128)

dataset = dataset.map(preprocess, batched=True)
dataset = dataset.rename_column("label", "labels")
dataset.set_format(type="torch", columns=["input_ids", "attention_mask", "labels"])

train_test = dataset.train_test_split(test_size=0.2, seed=42)
train_dataset = train_test["train"]
eval_dataset = train_test["test"]

# === 3. Model ===
model = AutoModelForSequenceClassification.from_pretrained(model_name, num_labels=2)

# === 4. Metrics ===
accuracy = evaluate.load("accuracy")

def compute_metrics(eval_pred):
    logits, labels = eval_pred
    preds = np.argmax(logits, axis=-1)
    return accuracy.compute(predictions=preds, references=labels)

# === 5. Training ===
args = TrainingArguments(
    output_dir="./scam_model",
    evaluation_strategy="epoch",
    save_strategy="epoch",
    learning_rate=2e-5,
    per_device_train_batch_size=16,
    num_train_epochs=3,
    weight_decay=0.01,
)

trainer = Trainer(
    model=model,
    args=args,
    train_dataset=train_dataset,
    eval_dataset=eval_dataset,
    tokenizer=tokenizer,
    compute_metrics=compute_metrics,
)

trainer.train()

# === 6. Save model ===
trainer.save_model("./scam_model")
tokenizer.save_pretrained("./scam_model")
