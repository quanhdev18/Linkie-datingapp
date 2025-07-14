
from pydantic import BaseModel, model_validator
from typing import Optional
from typing import Union
from datetime import datetime
from app.enum.ReportReason import (
    ReportReason,
    FakeAccountDescription,
    HarassmentDescription,
    ScamDescription,
)

class AccountReportCreate(BaseModel):
    reporter_id: int
    reported_id: int
    reason: ReportReason
    description: Union[
        FakeAccountDescription,
        HarassmentDescription,
        ScamDescription,
    ]
    detail_description: Optional[str] = None 

    @model_validator(mode="after")
    def validate_description(self):
        valid_map = {
            ReportReason.fake_account: FakeAccountDescription,
            ReportReason.harassment: HarassmentDescription,
            ReportReason.scam: ScamDescription,
        }

        enum_class = valid_map.get(self.reason)
        if enum_class and self.description not in [e.value for e in enum_class]:
            raise ValueError(
                f"Description không hợp lệ cho lý do '{self.reason}'. "
                f"Chỉ chấp nhận: {[e.value for e in enum_class]}"
            )
        return self


class AccountReportOut(BaseModel):
    id: int
    reporter_id: int
    reported_id: int
    reason: ReportReason
    description: str
    detail_description: Optional[str] = None 
    created_at: datetime

    class Config:
        orm_mode = True
