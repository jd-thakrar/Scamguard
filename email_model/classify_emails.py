import pandas as pd
import joblib

# === 0. Load model and vectorizer ===
model = joblib.load("logistic_model.pkl")
vectorizer = joblib.load("tfidf_vectorizer.pkl")

# === 1. Option A: Classify a list of emails ===
new_emails = [
    "Congratulations! You won a $1000 gift card. Click here to claim.",
    "Hi John, can we meet tomorrow to discuss the project?"
]

X_new = vectorizer.transform(new_emails)
preds = model.predict(X_new)

for email, label in zip(new_emails, preds):
    print(f"Email: {email}\nPrediction: {'Spam' if label==1 else 'Legitimate'}\n")

# === 2. Option B: Classify emails from a CSV ===
# CSV should have a column named 'text'
try:
    df_new = pd.read_csv("new_emails.csv")
    if "text" not in df_new.columns:
        raise ValueError("CSV must contain a 'text' column.")
    
    X_csv = vectorizer.transform(df_new["text"])
    df_new["prediction"] = model.predict(X_csv)
    df_new["prediction"] = df_new["prediction"].map({0:"Legitimate", 1:"Spam"})
    
    # Save results
    df_new.to_csv("classified_emails.csv", index=False)
    print("✅ Classified emails saved as 'classified_emails.csv'")
except FileNotFoundError:
    print("No new_emails.csv found. Skipping CSV classification.")
