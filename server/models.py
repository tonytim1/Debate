from dataclasses import dataclass
from typing import Optional


@dataclass
class User:
    sid: str
    ready: bool
    team: bool


@dataclass
class Room:
    id: str
    name: str
    tags: list[str]
    teams: bool
    team_names: list[str]
    room_size: int
    time_to_start: float
    spectators: bool
    users_list: dict[str, User]
    spectators_list: list[str]
    moderator: str
    is_conversation: bool
    pictureId: Optional[int]
