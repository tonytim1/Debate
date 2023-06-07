from dataclasses import dataclass
from typing import Optional


@dataclass
class User:
    ready: bool
    team: bool


@dataclass
class Room:
    id: str
    name: str
    tags: list[str]
    teams: bool
    room_size: int
    time_to_start: float
    spectators: bool
    users_list: dict[str, User]
    spectators_list: list[str]
    moderator: str
    is_conversation: bool
    pictureId: Optional[int]