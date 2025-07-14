from geoalchemy2.functions import ST_SetSRID, ST_MakePoint, ST_Distance
from sqlalchemy.orm import Session, joinedload
from app.models.UserModel import Account
from app.models.LocationModel import Location
from datetime import datetime
from geopy.geocoders import Nominatim
from app.schemas.UserSchema import AccountWithAvatarOut

class LocationService:

    @staticmethod
    def update_location(account_id: int, latitude: float, longitude: float, db: Session):
        # Truy vấn account từ database
        account = db.query(Account).filter(Account.id == account_id).first()
        if not account:
            return None  # Không tìm thấy tài khoản

        # Tạo điểm địa lý từ latitude và longitude
        point = ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)

        # Kiểm tra xem tài khoản đã có location chưa
        location = db.query(Location).filter(Location.account_id == account_id).first()

        if location:
            # Cập nhật vị trí nếu đã có location
            location.latitude = latitude
            location.longitude = longitude
            location.point = point  # Cập nhật trường point
            location.last_updated = datetime.utcnow()  # Cập nhật thời gian thay đổi vị trí
            db.commit()
            db.refresh(location)
        else:
            # Tạo mới location nếu chưa có
            location = Location(
                latitude=latitude,
                longitude=longitude,
                point=point,
                account_id=account_id,
                last_updated=datetime.utcnow()
            )
            db.add(location)
            db.commit()
            db.refresh(location)

        return location

    @staticmethod
    def find_nearby_users_by_account_id(account_id: int, db: Session, radius: int = 10):
        current_location = db.query(Location).filter(Location.account_id == account_id).first()
        if not current_location:
            return []

        current_point = ST_SetSRID(ST_MakePoint(current_location.longitude, current_location.latitude), 4326)

    # Lấy danh sách tài khoản gần đó, JOIN cả avatar và location
        accounts = (
            db.query(Account)
            .join(Location)
            .options(joinedload(Account.avatar))
            .filter(
                Account.id != account_id,
                ST_Distance(Location.point, current_point) <= radius * 1000
            )
            .all()
        )

    # Trả về dữ liệu đầy đủ để serialize bằng `AccountWithAvatarOut`
        results = []
        for acc in accounts:
            results.append(AccountWithAvatarOut(
                id=acc.id,
                email=acc.email,
                is_activated=acc.is_activated,
                role=acc.role,
                avatar=acc.avatar,  # sẽ được serialize đúng
                latitude=acc.location.latitude,
                longitude=acc.location.longitude,
            ))

        return results

    # @staticmethod
    # def get_location_name(latitude, longitude):
    #     geolocator = Nominatim(user_agent="myGeocoder")
    #     location = geolocator.reverse((latitude, longitude), language='vi')

    #     if location:
    #         return location.address  # Trả về tên địa điểm (thành phố, quốc gia...)
    #     else:
    #         return "Location not found"
    @staticmethod
    def get_location_name(latitude, longitude):
        geolocator = Nominatim(user_agent="myGeocoder")
        location = geolocator.reverse((latitude, longitude), language='vi')

        if location:
            address = location.raw.get("address", {})
            # Ưu tiên phường, xã
            ward = (
                address.get("neighbourhood") or
                address.get("suburb") or
                address.get("quarter") or
                address.get("village") or
                address.get("hamlet") or
                address.get("town")
            )

            # Quận/Huyện
            district = (
                address.get("city_district") or
                address.get("district")
            )

            # Thành phố
            city = (
                address.get("city") or
                address.get("municipality") or
                address.get("state")
            )

            if ward and city:
                return f"{ward}, {city}"
            elif district and city:
                return f"{district}, {city}"
            elif city:
                return city
            else:
                return "Không rõ địa điểm"
        else:
            return "Không rõ địa điểm"


    @staticmethod
    def get_location_by_account_id(account_id: int, db: Session):
        location = db.query(Location).filter(Location.account_id == account_id).first()
        return location

    
    
    
    
    

