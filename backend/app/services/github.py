import logging
from typing import Any, Dict, List, Optional, Tuple
from datetime import datetime
# pyrefly: ignore[missing-import]
import httpx

from app.config import get_settings

logger = logging.getLogger("portfolio.github")

GITHUB_USER = "Tanvi-1496"

FALLBACK_REPOS = [
    {
        "name": "support-copilot-ai-agent-rag",
        "html_url": "https://github.com/Tanvi-1496/support-copilot-ai-agent-rag",
        "description": "RAG and agentic AI support copilot.",
        "language": "Python",
        "stargazers_count": 0,
        "updated_at": "",
    },
    {
        "name": "SkillSwap-Learn.-Mentor.-Grow.",
        "html_url": "https://github.com/Tanvi-1496/SkillSwap-Learn.-Mentor.-Grow.",
        "description": "AI-powered student and mentor matching.",
        "language": "TypeScript",
        "stargazers_count": 0,
        "updated_at": "",
    },
    {
        "name": "DMart-Retail-Analytics",
        "html_url": "https://github.com/Tanvi-1496/DMart-Retail-Analytics",
        "description": "Retail OLAP and predictive analytics.",
        "language": "Python",
        "stargazers_count": 0,
        "updated_at": "",
    },
]

FALLBACK_GIT_DATA: Dict[str, Any] = {
    "repos": 12,
    "followers": 5,
    "stars": 0,
    "recent": FALLBACK_REPOS,
    "languages": [["Python", 4], ["TypeScript", 3], ["JavaScript", 2], ["Other", 1]],
}


async def fetch_github_data() -> Tuple[Optional[Dict[str, Any]], bool]:
    """
    Fetch GitHub profile and repository stats.
    Returns:
        (git_data, success_flag)
    """
    settings = get_settings()
    headers = {
        "User-Agent": "Portfolio-Backend/1.0",
        "Accept": "application/vnd.github.v3+json",
    }
    if settings.GITHUB_TOKEN:
        headers["Authorization"] = f"Bearer {settings.GITHUB_TOKEN}"

    user_url = f"https://api.github.com/users/{GITHUB_USER}"
    repos_url = f"https://api.github.com/users/{GITHUB_USER}/repos?per_page=100&sort=updated"

    try:
        async with httpx.AsyncClient(timeout=10.0, headers=headers) as client:
            user_resp, repos_resp = await client.get(user_url), await client.get(repos_url)

            if user_resp.status_code != 200 or repos_resp.status_code != 200:
                logger.warning(
                    "GitHub API request returned non-200 status",
                    extra={
                        "user_status": user_resp.status_code,
                        "repos_status": repos_resp.status_code,
                    },
                )
                return None, False

            user_data = user_resp.json()
            repos_data: List[Dict[str, Any]] = repos_resp.json()

            # Filter non-fork repositories
            original_repos = [repo for repo in repos_data if not repo.get("fork", False)]

            # Total stars
            total_stars = sum(repo.get("stargazers_count", 0) for repo in original_repos)

            # Languages count
            lang_counts: Dict[str, int] = {}
            for repo in original_repos:
                lang = repo.get("language") or "Other"
                lang_counts[lang] = lang_counts.get(lang, 0) + 1

            sorted_languages = sorted(lang_counts.items(), key=lambda x: x[1], reverse=True)[:5]
            languages_list = [[lang, count] for lang, count in sorted_languages]

            # 3 most recently updated repos
            def parse_updated(r: Dict[str, Any]) -> str:
                return r.get("updated_at") or ""

            sorted_recent = sorted(original_repos, key=parse_updated, reverse=True)[:3]
            recent_repos = [
                {
                    "name": repo.get("name", ""),
                    "html_url": repo.get("html_url", f"https://github.com/{GITHUB_USER}/{repo.get('name', '')}"),
                    "description": repo.get("description"),
                    "language": repo.get("language"),
                    "stargazers_count": repo.get("stargazers_count", 0),
                    "updated_at": repo.get("updated_at", ""),
                }
                for repo in sorted_recent
            ]

            result = {
                "repos": user_data.get("public_repos", len(original_repos)),
                "followers": user_data.get("followers", 0),
                "stars": total_stars,
                "recent": recent_repos,
                "languages": languages_list,
            }
            return result, True
    except Exception:
        logger.error("Exception fetching GitHub data", exc_info=False)
        return None, False


async def fetch_contributions_data() -> Tuple[List[Dict[str, Any]], bool]:
    """
    Fetch contribution graph data for the past year.
    Returns:
        (contributions_list, success_flag)
    """
    url = f"https://github-contributions-api.jogruber.de/v4/{GITHUB_USER}?y=last"
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.get(url)
            if resp.status_code == 200:
                data = resp.json()
                contributions = data.get("contributions", [])
                return contributions, True
            else:
                logger.warning(
                    "Contributions API returned non-200 status",
                    extra={"status_code": resp.status_code},
                )
                return [], False
    except Exception:
        logger.error("Exception fetching contributions data", exc_info=False)
        return [], False
