from pydantic import BaseModel
from typing import Generic, TypeVar, List

T = TypeVar("T")

class PaginatedResponse(BaseModel, Generic[T]):
    total: int
    total_pages: int
    page: int
    size: int
    items: List[T]

