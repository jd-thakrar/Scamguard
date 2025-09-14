import re

urgency_words = ["urgent","immediately","now","asap","emergency","critical","deadline","expire","last chance","final","hurry","quick","fast","instant"]
fear_words = ["arrest","jail","prison","legal action","lawsuit","court","penalty","fine","punishment","consequences","trouble","danger","risk","threat"]
authority_words = ["police","officer","department","government","official","authority","cbi","income tax","enforcement","directorate","cyber crime","investigation"]
financial_words = ["money","payment","transfer","bank","account","deposit","withdraw","card","otp","pin","password","rupees","amount","fee","charge"]

def score_keywords(text: str, keywords: list[str]) -> float:
    text_lower = text.lower()
    total_words = max(len(text_lower.split()),1)
    matches = 0
    for kw in keywords:
        matches += len(re.findall(rf"\b{kw}\b", text_lower))
    return min((matches/total_words)*10,1)

def analyze_sentiment(text: str):
    return {
        "urgency": score_keywords(text, urgency_words),
        "fear": score_keywords(text, fear_words),
        "authority": score_keywords(text, authority_words),
        "financial": score_keywords(text, financial_words),
    }

def extract_entities(text: str):
    return {
        "phoneNumbers": re.findall(r"(\+91[-\s]?)?[6-9]\d{9}", text),
        "amounts": re.findall(r"(?:rs\.?|rupees?)\s*(\d+(?:,\d+)*(?:\.\d+)?)", text, flags=re.I),
        "dates": re.findall(r"\b\d{1,2}[-/]\d{1,2}[-/]\d{2,4}\b|\b\d{1,2}\s+(?:hours?|days?|minutes?)\b", text, flags=re.I),
        "emails": re.findall(r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}", text),
        "urls": re.findall(r"https?:\/\/[^\s]+", text),
    }
