import streamlit as st
import scamguard_backend as backend
import re

# ------------------ Helpers ------------------ #
def is_valid_email(email: str) -> bool:
    """Simple regex check for email address validity."""
    pattern = r'^[\w\.-]+@[\w\.-]+\.\w+$'
    return re.match(pattern, email) is not None

def is_valid_number(number: str) -> bool:
    """Check if phone number is numeric and at least 7 digits."""
    return number.isdigit() and len(number) >= 7

# ------------------ UI ------------------ #
st.set_page_config(page_title="ScamGuard", page_icon="📧", layout="centered")

st.title("📧 ScamGuard - Multi-Channel Classifier")
st.write("Classify **Emails**, **SMS messages**, or detect **Scams**.")

# ------------------ Selection ------------------ #
option = st.radio("Choose what to analyze:", ["Email", "SMS Scam Detection"])

# ------------------ Email Section ------------------ #
if option == "Email":
    st.subheader("📩 Email Spam Detection")
    email_address = st.text_input("📧 Sender Email Address:")
    message = st.text_area("✍️ Enter the email message:")

    if st.button("Analyze Email"):
        if not email_address.strip():
            st.error("⚠️ Please enter the sender email address.")
        elif not is_valid_email(email_address.strip()):
            st.error("⚠️ Invalid email format. Please enter a valid email (e.g., user@example.com).")
        elif not message.strip():
            st.error("⚠️ Please enter an email message.")
        else:
            if backend.EMAIL_AVAILABLE:
                result = backend.classify_email(message)
                st.success(f"**Email Classification Result:** {result}")
                st.info(f"**Sender Email:** {email_address}")
            else:
                st.warning("⚠️ Email model not available")

# ------------------ SMS Section ------------------ #
elif option == "SMS Scam Detection":
    st.subheader("📱 SMS Scam Detection")
    sms_message = st.text_area("✍️ Enter the SMS message:")
    sender_number = st.text_input("📟 Sender phone number:")

    if st.button("Analyze SMS"):
        if not sms_message.strip():
            st.error("⚠️ Please enter an SMS message.")
        elif not sender_number.strip():
            st.error("⚠️ Please enter a sender phone number.")
        elif not is_valid_number(sender_number.strip()):
            st.error("⚠️ Invalid phone number. Must be numeric and at least 7 digits.")
        else:
            if backend.SMS_AVAILABLE:
                result = backend.classify_sms(sms_message)
                st.success(f"**SMS Classification Result:** {result}")
                st.info(f"**Sender Number:** {sender_number}")
            else:
                st.warning("⚠️ SMS model not available")

# ------------------ General Decision ------------------ #
if st.checkbox("🔍 General Scam Detection"):
    general_message = st.text_area("✍️ Enter text to check (Email or SMS):")

    if st.button("Run General Detection"):
        if not general_message.strip():
            st.error("⚠️ Please enter a message for general detection.")
        else:
            overall = backend.decide_scam(general_message)
            st.success(f"**Overall Scam Detection Result:** {overall}")
