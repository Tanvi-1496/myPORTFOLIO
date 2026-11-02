from unittest.mock import AsyncMock, patch
# pyrefly: ignore[missing-import]
from fastapi.testclient import TestClient
from app.main import app
from app.services.cache import stats_cache

client = TestClient(app)


def test_stats_endpoint_structure():
    mock_gh = {
        "repos": 14,
        "followers": 8,
        "stars": 3,
        "recent": [],
        "languages": [["Python", 5]],
    }
    mock_contribs = [{"date": "2026-01-01", "count": 2, "level": 1}]
    mock_lc = {"total": 120, "easy": 60, "medium": 50, "hard": 10}

    with patch("app.routers.stats.fetch_github_data", new_callable=AsyncMock) as m_gh, \
         patch("app.routers.stats.fetch_contributions_data", new_callable=AsyncMock) as m_cb, \
         patch("app.routers.stats.fetch_leetcode_data", new_callable=AsyncMock) as m_lc:

        m_gh.return_value = (mock_gh, True)
        m_cb.return_value = (mock_contribs, True)
        m_lc.return_value = (mock_lc, True)

        stats_cache.clear()
        response = client.get("/api/stats")
        assert response.status_code == 200
        data = response.json()

        assert "github" in data
        assert "contributions" in data
        assert "leetcode" in data
        assert "stale" in data
        assert data["github"]["repos"] == 14
        assert data["leetcode"]["total"] == 120
        assert data["stale"] is False


def test_stats_cache_fallback_on_failure():
    # When all remote calls fail and cache is empty, it returns fallback with stale=True
    with patch("app.routers.stats.fetch_github_data", new_callable=AsyncMock) as m_gh, \
         patch("app.routers.stats.fetch_contributions_data", new_callable=AsyncMock) as m_cb, \
         patch("app.routers.stats.fetch_leetcode_data", new_callable=AsyncMock) as m_lc:

        m_gh.return_value = (None, False)
        m_cb.return_value = ([], False)
        m_lc.return_value = ({"total": 100, "easy": 55, "medium": 40, "hard": 5}, False)

        stats_cache.clear()
        response = client.get("/api/stats")
        assert response.status_code == 200
        data = response.json()
        assert data["stale"] is True
        assert data["github"]["repos"] >= 0
        assert data["leetcode"]["total"] >= 0
