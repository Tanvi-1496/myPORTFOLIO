# pyrefly: ignore[missing-import]
from slowapi import Limiter
# pyrefly: ignore[missing-import]
from slowapi.util import get_remote_address

# Shared rate limiter instance keyed by client IP address
limiter = Limiter(key_func=get_remote_address)
