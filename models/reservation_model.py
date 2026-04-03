from dataclasses import dataclass
from typing import Optional


@dataclass
class Reservation:
    id: Optional[int]
    service_id: int
    client_id: int
    provider_id: int
    reservation_date: str
    notes: Optional[str] = None
    status: str = 'pending'
