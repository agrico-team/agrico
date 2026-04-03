from dataclasses import dataclass
from typing import Optional


@dataclass
class Order:
    id: Optional[int]
    product_id: int
    buyer_id: int
    supplier_id: int
    quantity: int
    unit_price: float
    total_price: float
    status: str = 'pending'
