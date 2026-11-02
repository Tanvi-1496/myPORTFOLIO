import time
from typing import Any, Dict, Optional, Tuple
import threading

class MemoryCache:
    """Thread-safe in-memory cache supporting TTL and stale fallbacks."""

    def __init__(self, default_ttl_seconds: int = 3600):
        self._default_ttl = default_ttl_seconds
        self._store: Dict[str, Dict[str, Any]] = {}
        self._lock = threading.Lock()

    def get(self, key: str) -> Tuple[Optional[Any], bool]:
        """
        Retrieve a cached item.
        Returns:
            (value, is_expired)
            If the key has never been set, returns (None, True).
            If the key was set and is within TTL, returns (value, False).
            If the key was set but expired, returns (value, True).
        """
        with self._lock:
            entry = self._store.get(key)
            if entry is None:
                return None, True
            
            now = time.time()
            is_expired = (now - entry["timestamp"]) > entry["ttl"]
            return entry["value"], is_expired

    def set(self, key: str, value: Any, ttl_seconds: Optional[int] = None) -> None:
        """Store or update a value in the cache."""
        with self._lock:
            self._store[key] = {
                "value": value,
                "timestamp": time.time(),
                "ttl": ttl_seconds if ttl_seconds is not None else self._default_ttl
            }

    def clear(self) -> None:
        """Clear the cache."""
        with self._lock:
            self._store.clear()


# Global cache instance for stats and general caching
stats_cache = MemoryCache(default_ttl_seconds=3600)
