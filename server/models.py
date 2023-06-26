from dataclasses import dataclass
from typing import Optional


@dataclass
class User:
    sid: str
    ready: bool = False
    team: bool = False
    camera_ready: bool = False

@dataclass
class Room:
    id: str
    name: str
    tags: list[str]
    teams: bool
    team_names: list[str]
    room_size: int
    time_to_start: float
    allow_spectators: bool
    users_list: dict[str, User]
    spectators_list: dict[str, User]
    moderator: str
    is_conversation: bool
    pictureId: Optional[int]
