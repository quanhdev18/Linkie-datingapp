from enum import Enum

class ReportReason(str, Enum):
    fake_account = "Giả mạo tài khoản"
    harassment = "Quấy rối"
    scam = "Lừa đảo"

class FakeAccountDescription(str, Enum):
    me = "Tài khoản giả mạo tôi"
    friend = "Tài khoản giả mạo bạn của tôi"
    celebrity = "Tài khoản giả mạo người nổi tiếng"

class HarassmentDescription(str, Enum):
    hate_speech = "Ngôn từ thù ghét"
    unwanted_messages = "Tin nhắn không mong muốn"
    real_life = "Quấy rối ngoài đời thực"

class ScamDescription(str, Enum):
    love_scam = "Lừa đảo tình cảm"
    money = "Yêu cầu gửi tiền"
