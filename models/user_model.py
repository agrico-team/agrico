from dataclasses import dataclass
from typing import Optional


@dataclass
class User:
    id: Optional[int]
    full_name: str
    email: Optional[str]
    phone: Optional[str]
    role: str
    address: Optional[str] = None
