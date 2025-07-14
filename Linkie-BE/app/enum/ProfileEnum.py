import enum
from enum import Enum
class GenderEnum(enum.Enum):
    MALE = "male"
    FEMALE = "female"

class HobbyEnum(str, Enum):
    LISTENING_TO_MUSIC = "listening_to_music"
    SINGING = "singing"
    PLAYING_GUITAR = "playing_guitar"
    RUNNING = "running"
    YOGA = "yoga"
    READING = "reading"
    COOKING = "cooking"
    PHOTOGRAPHY = "photography"
    TRAVELING = "traveling"
    VIDEO_GAMES = "video_games"
    DOG_LOVER = "dog_lover"
    MEDITATION = "meditation"
    FASHION = "fashion"
    BLOGGING = "blogging"