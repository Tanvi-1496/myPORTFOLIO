import logging
from typing import Any, Dict, Optional, Tuple
# pyrefly: ignore[missing-import]
import httpx

logger = logging.getLogger("portfolio.leetcode")

LEETCODE_USERNAME = "Tanvi_1496"

FALLBACK_LEETCODE: Dict[str, int] = {
    "total": 100,
    "easy": 55,
    "medium": 40,
    "hard": 5,
}

GRAPHQL_QUERY = """
query userProblemsSolved($username: String!) {
  matchedUser(username: $username) {
    submitStatsGlobal {
      acSubmissionNum {
        difficulty
        count
      }
    }
  }
}
"""


async def fetch_leetcode_via_graphql() -> Optional[Dict[str, int]]:
    """Fetch problem counts directly via LeetCode's public GraphQL endpoint."""
    url = "https://leetcode.com/graphql"
    headers = {
        "Content-Type": "application/json",
        "User-Agent": (
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
            "AppleWebKit/537.36 (KHTML, like Gecko) "
            "Chrome/120.0.0.0 Safari/537.36"
        ),
        "Referer": f"https://leetcode.com/{LEETCODE_USERNAME}/",
    }
    payload = {
        "query": GRAPHQL_QUERY,
        "variables": {"username": LEETCODE_USERNAME},
    }

    async with httpx.AsyncClient(timeout=10.0, headers=headers) as client:
        resp = await client.post(url, json=payload)
        if resp.status_code != 200:
            return None
        data = resp.json()
        matched = data.get("data", {}).get("matchedUser")
        if not matched:
            return None

        stats_list = matched.get("submitStatsGlobal", {}).get("acSubmissionNum", [])
        counts: Dict[str, int] = {"total": 0, "easy": 0, "medium": 0, "hard": 0}

        for item in stats_list:
            diff = item.get("difficulty", "").lower()
            cnt = item.get("count", 0)
            if diff == "all":
                counts["total"] = cnt
            elif diff in counts:
                counts[diff] = cnt

        return counts


async def fetch_leetcode_via_stats_api() -> Optional[Dict[str, int]]:
    """Backup fetch via leetcode-stats-api proxy."""
    url = f"https://leetcode-stats-api.herokuapp.com/{LEETCODE_USERNAME}"
    async with httpx.AsyncClient(timeout=10.0) as client:
        resp = await client.get(url)
        if resp.status_code != 200:
            return None
        data = resp.json()
        if data.get("status") == "error":
            return None
        return {
            "total": data.get("totalSolved", 0),
            "easy": data.get("easySolved", 0),
            "medium": data.get("mediumSolved", 0),
            "hard": data.get("hardSolved", 0),
        }


async def fetch_leetcode_data() -> Tuple[Dict[str, int], bool]:
    """
    Fetch LeetCode stats with primary GraphQL query, secondary API fallback,
    and safe default values.
    Returns:
        (stats_dict, success_flag)
    """
    try:
        data = await fetch_leetcode_via_graphql()
        if data:
            return data, True
    except Exception:
        logger.warning("LeetCode GraphQL request failed, attempting secondary API", exc_info=False)

    try:
        data = await fetch_leetcode_via_stats_api()
        if data:
            return data, True
    except Exception:
        logger.warning("LeetCode secondary API failed", exc_info=False)

    return FALLBACK_LEETCODE, False
