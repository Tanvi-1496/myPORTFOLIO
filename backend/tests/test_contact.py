from unittest.mock import AsyncMock, patch
# pyrefly: ignore[missing-import]
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_contact_valid_submission():
    payload = {
        "name": "Jane Doe",
        "email": "jane@example.com",
        "message": "I would love to discuss a DevOps engineering internship opportunity.",
        "website": "",
    }
    with patch("app.routers.contact.deliver_contact_message", new_callable=AsyncMock) as mock_deliver:
        mock_deliver.return_value = True
        response = client.post("/api/contact", json=payload)
        assert response.status_code == 200
        assert response.json() == {"ok": True}
        assert mock_deliver.called


def test_contact_honeypot_silently_succeeds_without_sending():
    payload = {
        "name": "Spam Bot",
        "email": "spambot@example.com",
        "message": "Buy cheap backlinks today directly through this automated bot.",
        "website": "https://spammylink.com",
    }
    with patch("app.routers.contact.deliver_contact_message", new_callable=AsyncMock) as mock_deliver:
        response = client.post("/api/contact", json=payload)
        assert response.status_code == 200
        assert response.json() == {"ok": True}
        # Critical test: email delivery should NOT be invoked when honeypot is triggered
        assert not mock_deliver.called


def test_contact_invalid_email():
    payload = {
        "name": "Jane Doe",
        "email": "not-a-valid-email",
        "message": "Valid message with more than 10 characters.",
        "website": "",
    }
    response = client.post("/api/contact", json=payload)
    assert response.status_code == 422


def test_contact_name_too_short():
    payload = {
        "name": "J",
        "email": "jane@example.com",
        "message": "Valid message with more than 10 characters.",
        "website": "",
    }
    response = client.post("/api/contact", json=payload)
    assert response.status_code == 422


def test_contact_message_too_short():
    payload = {
        "name": "Jane Doe",
        "email": "jane@example.com",
        "message": "Hi!",
        "website": "",
    }
    response = client.post("/api/contact", json=payload)
    assert response.status_code == 422
