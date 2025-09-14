import os
import joblib

# ------------------ MODEL PATHS ------------------ #
EMAIL_MODEL_PATH = os.path.join("email_model", "logistic_model.pkl")
EMAIL_VECTORIZER_PATH = os.path.join("email_model", "tfidf_vectorizer.pkl")

SMS_MODEL_PATH = os.path.join("test_model", "logistic_model.pkl")
SMS_VECTORIZER_PATH = os.path.join("test_model", "tfidf_vectorizer.pkl")

# ------------------ LOAD MODELS ------------------ #
EMAIL_AVAILABLE, SMS_AVAILABLE = False, False
email_model, email_vectorizer, sms_model, sms_vectorizer = None, None, None, None

# Load Email Model
if os.path.exists(EMAIL_MODEL_PATH) and os.path.exists(EMAIL_VECTORIZER_PATH):
    try:
        email_model = joblib.load(EMAIL_MODEL_PATH)
        email_vectorizer = joblib.load(EMAIL_VECTORIZER_PATH)
        EMAIL_AVAILABLE = True
    except Exception as e:
        print("⚠️ Error loading email model:", e)

# Load SMS Model
if os.path.exists(SMS_MODEL_PATH) and os.path.exists(SMS_VECTORIZER_PATH):
    try:
        sms_model = joblib.load(SMS_MODEL_PATH)
        sms_vectorizer = joblib.load(SMS_VECTORIZER_PATH)
        SMS_AVAILABLE = True
    except Exception as e:
        print("⚠️ Error loading SMS model:", e)

# ------------------ CLASSIFICATION FUNCTIONS ------------------ #
def classify_email(text: str) -> str:
    """Classify input text as Spam/Not Spam (Email)."""
    if not EMAIL_AVAILABLE:
        return "Email model not available"
    vec = email_vectorizer.transform([text])
    pred = email_model.predict(vec)[0]
    return "Spam" if pred == 1 else "Not Spam"

def classify_sms(text: str) -> str:
    """Classify input text as Scam/Not Scam (SMS)."""
    if not SMS_AVAILABLE:
        return "SMS model not available"
    vec = sms_vectorizer.transform([text])
    pred = sms_model.predict(vec)[0]
    return "Scam" if pred == 1 else "Not Scam"

def decide_scam(text: str) -> str:
    """General decision wrapper."""
    if EMAIL_AVAILABLE:
        return classify_email(text)
    elif SMS_AVAILABLE:
        return classify_sms(text)
    return "No model available"
