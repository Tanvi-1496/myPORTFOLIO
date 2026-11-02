import asyncio
import logging
from typing import Any, Dict, List
# pyrefly: ignore[missing-import]
from fastapi import APIRouter, status
# pyrefly: ignore[missing-import]
from pydantic import BaseModel

from app.services.cache import stats_cache
from app.services.github import (
    FALLBACK_GIT_DATA,
    fetch_contributions_data,
    fetch_github_data,
)
from app.services.leetcode import FALLBACK_LEETCODE, fetch_leetcode_data

logger = logging.getLogger("portfolio.routers.stats")

router = APIRouter()

CACHE_KEY_GITHUB = "stats:github"
CACHE_KEY_CONTRIBUTIONS = "stats:contributions"
CACHE_KEY_LEETCODE = "stats:leetcode"


class StatsResponse(BaseModel):
    github: Dict[str, Any]
    contributions: List[Dict[str, Any]]
    leetcode: Dict[str, Any]
    stale: bool = False


@router.get(
    "/stats",
    response_model=StatsResponse,
    status_code=status.HTTP_200_OK,
    summary="Aggregated GitHub, Contributions, and LeetCode stats",
)
async def get_aggregated_stats() -> StatsResponse:
    # Check if we have complete, unexpired cache
    cached_gh, gh_expired = stats_cache.get(CACHE_KEY_GITHUB)
    cached_contribs, contribs_expired = stats_cache.get(CACHE_KEY_CONTRIBUTIONS)
    cached_lc, lc_expired = stats_cache.get(CACHE_KEY_LEETCODE)

    # If all items are cached and still fresh, return immediately
    if (
        cached_gh is not None
        and not gh_expired
        and cached_contribs is not None
        and not contribs_expired
        and cached_lc is not None
        and not lc_expired
    ):
        return StatsResponse(
            github=cached_gh,
            contributions=cached_contribs,
            leetcode=cached_lc,
            stale=False,
        )

    # Concurrently fetch live data
    gh_task = fetch_github_data()
    contrib_task = fetch_contributions_data()
    lc_task = fetch_leetcode_data()

    gh_res, contrib_res, lc_res = await asyncio.gather(
        gh_task, contrib_task, lc_task, return_exceptions=True
    )

    is_stale = False

    # Process GitHub
    final_gh: Dict[str, Any]
    if isinstance(gh_res, tuple) and gh_res[1] and gh_res[0] is not None:
        final_gh = gh_res[0]
        stats_cache.set(CACHE_KEY_GITHUB, final_gh)
    elif cached_gh is not None:
        final_gh = cached_gh
        is_stale = True
    else:
        final_gh = FALLBACK_GIT_DATA
        is_stale = True

    # Process Contributions
    final_contribs: List[Dict[str, Any]]
    if isinstance(contrib_res, tuple) and contrib_res[1]:
        final_contribs = contrib_res[0]
        stats_cache.set(CACHE_KEY_CONTRIBUTIONS, final_contribs)
    elif cached_contribs is not None:
        final_contribs = cached_contribs
        is_stale = True
    else:
        final_contribs = []
        is_stale = True

    # Process LeetCode
    final_lc: Dict[str, Any]
    if isinstance(lc_res, tuple) and lc_res[1]:
        final_lc = lc_res[0]
        stats_cache.set(CACHE_KEY_LEETCODE, final_lc)
    elif cached_lc is not None:
        final_lc = cached_lc
        is_stale = True
    else:
        final_lc = FALLBACK_LEETCODE
        is_stale = True

    return StatsResponse(
        github=final_gh,
        contributions=final_contribs,
        leetcode=final_lc,
        stale=is_stale,
    )
