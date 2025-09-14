# === 0. Import libraries ===
import pandas as pd
from datasets import Dataset
from transformers import AutoTokenizer, AutoModelForSequenceClassification, TrainingArguments, Trainer
import numpy as np
import evaluate
import os

# === 1. Load dataset ===
if os.path.exists("emails.xlsx"):
    print("📂 Loading Excel file: emails.xlsx")
    df = pd.read_excel("emails.xlsx")
elif os.path.exists("emails.csv"):
    print("📂 Loading CSV file: emails.csv")
    df = pd.read_csv("emails.csv")
else:
    raise FileNotFoundError("❌ Could not find emails.xlsx or emails.csv in current folder")

# === 2. Preprocess dataset ===
# Rename columns consistently (assuming 'text' and 'spam' exist)
df = df.rename(columns={"spam": "label", "text": "text"})

# Convert label column to int (0=legitimate, 1=scam/spam)
df["label"] = df["label"].astype(int)

# Keep only required columns
df = df[["text", "label"]]

# HuggingFace Dataset
dataset = Dataset.from_pandas(df)

# === 3. Tokenize ===
model_name = "distilbert-base-uncased"
tokenizer = AutoTokenizer.from_pretrained(model_name)

def preprocess(examples):
    return tokenizer(examples["text"], truncation=True, padding="max_length", max_length=256)

dataset = dataset.map(preprocess, batched=True)
dataset = dataset.rename_column("label", "labels")
dataset.set_format(type="torch", columns=["input_ids", "attention_mask", "labels"])

# Train/test split
train_test = dataset.train_test_split(test_size=0.2, seed=42)
train_dataset = train_test["train"]
eval_dataset = train_test["test"]

# === 4. Load model ===
model = AutoModelForSequenceClassification.from_pretrained(model_name, num_labels=2)

# === 5. Metrics ===
accuracy = evaluate.load("accuracy")

def compute_metrics(eval_pred):
    logits, labels = eval_pred
    preds = np.argmax(logits, axis=-1)
    return accuracy.compute(predictions=preds, references=labels)

# === 6. Training arguments ===
args = TrainingArguments(
    output_dir="./email_model",
    evaluation_strategy="epoch",
    save_strategy="epoch",
    learning_rate=2e-5,
    per_device_train_batch_size=16,
    num_train_epochs=3,
    weight_decay=0.01,
    logging_dir="./logs",
    logging_steps=50,
)

# === 7. Trainer ===
trainer = Trainer(
    model=model,
    args=args,
    train_dataset=train_dataset,
    eval_dataset=eval_dataset,
    tokenizer=tokenizer,
    compute_metrics=compute_metrics,
)

# === 8. Train the model ===
trainer.train()

# === 9. Save model ===
print("✅ Saving trained model to ./email_model")
trainer.save_model("./email_model")
tokenizer.save_pretrained("./email_model")

print("🎉 Training complete! Model saved locally.")
