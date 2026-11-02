# pyrefly: ignore[missing-import]
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_chat_graceful_fallback():
    payload = {
        "message": "What projects has Tanvi worked on?",
        "history": [],
    }
    response = client.post("/api/chat", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "answer" in data
    assert "showContactLink" in data
    assert isinstance(data["showContactLink"], bool)


def test_chat_message_too_long():
    payload = {
        "message": "A" * 501,
        "history": [],
    }
    response = client.post("/api/chat", json=payload)
    assert response.status_code == 422


def test_chat_history_handling():
    payload = {
        "message": "Is she open to internships?",
        "history": [
            {"role": "user", "content": "Hello"},
            {"role": "assistant", "content": "Hi! How can I help you?"},
        ],
    }
    response = client.post("/api/chat", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "answer" in data
