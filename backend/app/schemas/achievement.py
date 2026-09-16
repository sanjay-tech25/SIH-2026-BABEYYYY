from typing import List, Optional
from pydantic import BaseModel


class AchievementRead(BaseModel):
    id: str
    slug: str
    title: str
    description: str
    category: str
    icon_url: str
    xp_bonus: int
    unlocked: bool
    unlocked_at: Optional[str] = None
