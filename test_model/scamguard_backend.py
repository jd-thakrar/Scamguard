import os
import re
import joblib
import numpy as np

# ------------------ MODEL PATHS ------------------ #
EMAIL_MODEL_PATH = os.path.join("mail_model", "logistic_model.pkl")
SMS_MODEL_PATH = os.path.join("test_model", "logistic_model.pkl")

# Load models safely
def load_model(path):
    if not os.path.exists(path):
        print(f"⚠️ Warning: Model file not found at {path}")
        return None
    try:
        return joblib.load(path)
    except Exception as e:
        print(f"❌ Error loading model {path}: {e}")
        return None

email_model = load_model(EMAIL_MODEL_PATH)
sms_model = load_model(SMS_MODEL_PATH)

# Availability flags
EMAIL_AVAILABLE = email_model is not None
SMS_AVAILABLE = sms_model is not None

# ------------------ VALIDATION HELPERS ------------------ #

def validate_email(email: str) -> bool:
    """Check if email format is valid"""
    if not email or not isinstance(email, str):
        return False
    return bool(re.match(r"[^@]+@[^@]+\.[^@]+", email))

def validate_phone(number: str) -> bool:
    """Check if phone number looks valid (10-15 digits)"""
    if not number or not isinstance(number, str):
        return False
    return bool(re.match(r"^\+?\d{10,15}$", number))

def validate_message(msg: str) -> bool:
    """Ensure message is non-empty and string"""
    return bool(msg and isinstance(msg, str) and len(msg.strip()) > 3)

# ------------------ CLASSIFICATION ------------------ #

def classify_email(email_text: str):
    """Classify email content"""
    if not validate_message(email_text):
        return "❌ Invalid email content"
    if EMAIL_AVAILABLE:
        try:
            result = email_model.predict([email_text])[0]
            return "✅ Safe Email" if result == 0 else "⚠️ Scam Email"
        except Exception as e:
            return f"❌ Email classification failed: {e}"
    return "⚠️ Email model not available"

def classify_sms(message: str, number: str):
    """Classify SMS content with number validation"""
    if not validate_message(message):
        return "❌ Invalid SMS message"
    if not validate_phone(number):
        return "❌ Invalid phone number"
    if SMS_AVAILABLE:
        try:
            result = sms_model.predict([message])[0]
            return "✅ Safe SMS" if result == 0 else "⚠️ Scam SMS"
        except Exception as e:
            return f"❌ SMS classification failed: {e}"
    return "⚠️ SMS model not available"

# ------------------ ANALYSIS HELPERS ------------------ #

def find_similar_scams(text: str):
    """Stub: In production, compare against a scam DB"""
    if not validate_message(text):
        return []
    known = ["lottery", "prize", "urgent", "bank account", "password"]
    return [word for word in known if word in text.lower()]

def analyze_sender_reputation(sender: str):
    """Basic reputation check for sender (email/phone)"""
    if not sender:
        return "❌ No sender provided"
    if "@" in sender:
        return "⚠️ Suspicious domain" if not sender.endswith((".com", ".org", ".net")) else "✅ Looks okay"
    elif sender.isdigit():
        return "⚠️ Shortcode number, be cautious" if len(sender) < 10 else "✅ Number looks okay"
    return "Unknown sender format"
