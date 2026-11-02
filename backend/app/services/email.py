import asyncio
import html
import logging
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from typing import Optional
# pyrefly: ignore[missing-import]
import httpx

from app.config import get_settings

logger = logging.getLogger("portfolio.email")


async def send_via_resend(name: str, email: str, message: str) -> bool:
    """Send an email using Resend's HTTP API."""
    settings = get_settings()
    if not settings.RESEND_API_KEY:
        return False

    url = "https://api.resend.com/emails"
    headers = {
        "Authorization": f"Bearer {settings.RESEND_API_KEY}",
        "Content-Type": "application/json",
    }
    safe_name = html.escape(name)
    safe_email = html.escape(email)
    safe_message = html.escape(message).replace("\n", "<br>")

    payload = {
        "from": settings.CONTACT_FROM_EMAIL,
        "to": [settings.CONTACT_TO_EMAIL],
        "reply_to": email,
        "subject": f"Portfolio Contact: {name}",
        "text": f"Name: {name}\nEmail: {email}\n\nMessage:\n{message}",
        "html": (
            f"<h3>New Portfolio Contact Message</h3>"
            f"<p><strong>From:</strong> {safe_name} ({safe_email})</p>"
            f"<hr/>"
            f"<p>{safe_message}</p>"
        ),
    }

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.post(url, json=payload, headers=headers)
            if response.status_code in (200, 201):
                logger.info("Email successfully sent via Resend API")
                return True
            else:
                logger.error(
                    "Resend API returned non-200 status",
                    extra={"status_code": response.status_code},
                )
                return False
    except Exception as e:
        logger.error("Exception during Resend API call", exc_info=False)
        return False


def _send_smtp_sync(name: str, email: str, message: str) -> bool:
    """Synchronous SMTP email delivery for running inside thread pool."""
    settings = get_settings()
    if not settings.SMTP_HOST:
        return False

    msg = MIMEMultipart("alternative")
    sender = settings.SMTP_FROM_EMAIL or settings.CONTACT_FROM_EMAIL or "no-reply@portfolio.local"
    msg["From"] = sender
    msg["To"] = settings.CONTACT_TO_EMAIL
    msg["Reply-To"] = email
    msg["Subject"] = f"Portfolio Contact: {name}"

    safe_name = html.escape(name)
    safe_email = html.escape(email)
    safe_message = html.escape(message).replace("\n", "<br>")

    text_content = f"Name: {name}\nEmail: {email}\n\nMessage:\n{message}"
    html_content = (
        f"<h3>New Portfolio Contact Message</h3>"
        f"<p><strong>From:</strong> {safe_name} ({safe_email})</p>"
        f"<hr/>"
        f"<p>{safe_message}</p>"
    )

    msg.attach(MIMEText(text_content, "plain"))
    msg.attach(MIMEText(html_content, "html"))

    try:
        if settings.SMTP_PORT == 465:
            server = smtplib.SMTP_SSL(settings.SMTP_HOST, settings.SMTP_PORT, timeout=10.0)
        else:
            server = smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT, timeout=10.0)
            server.ehlo()
            server.starttls()
            server.ehlo()

        if settings.SMTP_USER and settings.SMTP_PASSWORD:
            server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)

        server.sendmail(sender, [settings.CONTACT_TO_EMAIL], msg.as_string())
        server.quit()
        logger.info("Email successfully sent via SMTP fallback")
        return True
    except Exception as e:
        logger.error("Exception during SMTP email send", exc_info=False)
        return False


async def send_via_smtp(name: str, email: str, message: str) -> bool:
    """Asynchronously send an email using SMTP fallback."""
    return await asyncio.to_thread(_send_smtp_sync, name, email, message)


async def save_to_supabase(name: str, email: str, message: str) -> bool:
    """Optionally store contact message in Supabase contact_messages table."""
    settings = get_settings()
    if not settings.SUPABASE_URL or not settings.SUPABASE_SERVICE_KEY:
        return False

    endpoint = f"{settings.SUPABASE_URL.rstrip('/')}/rest/v1/contact_messages"
    headers = {
        "apikey": settings.SUPABASE_SERVICE_KEY,
        "Authorization": f"Bearer {settings.SUPABASE_SERVICE_KEY}",
        "Content-Type": "application/json",
        "Prefer": "return=minimal",
    }
    payload = {
        "name": name,
        "email": email,
        "message": message,
    }

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.post(endpoint, json=payload, headers=headers)
            if response.status_code in (200, 201, 204):
                logger.info("Message record saved to Supabase")
                return True
            else:
                logger.warning(
                    "Supabase returned unexpected status code",
                    extra={"status_code": response.status_code},
                )
                return False
    except Exception:
        logger.error("Exception while storing message to Supabase", exc_info=False)
        return False


async def deliver_contact_message(name: str, email: str, message: str) -> bool:
    """
    Deliver contact message via Resend, falling back to SMTP.
    Also save to Supabase if configured.
    """
    settings = get_settings()

    # If Supabase is configured, record message
    if settings.SUPABASE_URL and settings.SUPABASE_SERVICE_KEY:
        asyncio.create_task(save_to_supabase(name, email, message))

    # Primary delivery: Resend HTTP API
    if settings.RESEND_API_KEY:
        sent = await send_via_resend(name, email, message)
        if sent:
            return True
        logger.warning("Resend delivery failed; checking SMTP fallback")

    # Secondary delivery: SMTP Fallback
    if settings.SMTP_HOST:
        sent = await send_via_smtp(name, email, message)
        if sent:
            return True

    # If in local development or demo without email keys set, log and return True so demo works
    if not settings.RESEND_API_KEY and not settings.SMTP_HOST:
        logger.info(
            "Neither RESEND_API_KEY nor SMTP_HOST configured. Simulating delivery in dev mode."
        )
        return True

    return False
