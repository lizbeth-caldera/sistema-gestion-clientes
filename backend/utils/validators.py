import re

# RFC mexicano:  3-4 letras + 6 dígitos fecha + 3 alfanum
#Esta es una validacion basica en México 
RFC_RE = re.compile(r"^[A-ZÑ&]{3,4}\d{6}[A-Z0-9]{3}$", re.IGNORECASE)

EMAIL_RE = re.compile(
    r"^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$",
    re.IGNORECASE
)

PHONE_RE = re.compile(r"^\+?\d{2,4}?[-.\s]?\d{3}[-.\s]?\d{4}$")

def valid_rfc(rfc: str) -> bool:
    return bool(RFC_RE.fullmatch(rfc or ""))

def valid_email(email: str) -> bool:
    return bool(EMAIL_RE.fullmatch(email or ""))

def valid_phone(phone: str) -> bool:
    return bool(PHONE_RE.fullmatch(phone or ""))
