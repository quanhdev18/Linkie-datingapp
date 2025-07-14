# from fastapi import APIRouter, Depends
# from sqlalchemy.ext.asyncio import AsyncSession
# from app.schemas.location import LocationUpdate
# from app.core.database import get_db
# from app.core.redis_client import redis_client
# from app.crud import location as crud_location

# router = APIRouter()

# @router.post("/users/location")
# async def update_location(data: LocationUpdate, db: AsyncSession = Depends(get_db)):
#     redis_client.geoadd("user_locations", (data.lng, data.lat, str(data.account_id)))
#     await crud_location.upsert_user_location(db, data.account_id, data.lat, data.lng)
#     return {"message": "Đã cập nhật vị trí"}

# @router.get("/users/nearby")
# async def get_nearby_users(account_id: int, radius_km: float = 10, db: AsyncSession = Depends(get_db)):
#     pos = redis_client.geopos("user_locations", str(account_id))
#     if not pos or pos[0] is None:
#         return {"message": "Không tìm thấy vị trí người dùng"}

#     lng, lat = pos[0]

#     nearby_ids = redis_client.geosearch(
#         "user_locations",
#         longitude=lng,
#         latitude=lat,
#         radius=radius_km,
#         unit="km",
#         count=100
#     )
#     nearby_ids = [int(uid) for uid in nearby_ids if int(uid) != account_id]

#     result = await crud_location.get_nearby_user_profiles(db, nearby_ids)
#     return {"nearby_users": result}


# from fastapi import APIRouter, Depends
# from sqlalchemy.ext.asyncio import AsyncSession
# from app.schemas.location import LocationUpdate
# from app.core.database import get_db
# from app.core.redis_client import redis_client
# from app.crud import location as crud_location

# router = APIRouter()

# @router.post("/users/location")
# async def update_location(data: LocationUpdate, db: AsyncSession = Depends(get_db)):
#     # Cập nhật vị trí vào Redis
#     redis_client.geoadd("user_locations", (data.lng, data.lat, str(data.account_id)))

#     # Cập nhật vị trí vào PostgreSQL (PostGIS)
#     await crud_location.upsert_user_location(db, data.account_id, data.lat, data.lng)

#     return {"message": "Đã cập nhật vị trí"}

# @router.get("/users/nearby")
# async def get_nearby_users(account_id: int, radius_km: float = 10, db: AsyncSession = Depends(get_db)):
#     # Lấy vị trí của người dùng từ Redis
#     pos = redis_client.geopos("user_locations", str(account_id))
#     if not pos or pos[0] is None:
#         return {"message": "Không tìm thấy vị trí người dùng"}

#     lng, lat = pos[0]

#     # Tìm các account_id gần đó
#     nearby_ids = redis_client.geosearch(
#         "user_locations",
#         longitude=lng,
#         latitude=lat,
#         radius=radius_km,
#         unit="km",
#         count=100
#     )

#     # Loại bỏ chính bản thân
#     nearby_ids = [int(uid) for uid in nearby_ids if int(uid) != account_id]

#     # Lấy thông tin chi tiết từ database
#     result = await crud_location.get_nearby_user_profiles(db, nearby_ids)

#     return {"nearby_users": result}

# app/routes/location.py

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.schemas.location import LocationUpdate
from app.core.database import get_db
from app.core.redis_client import redis_client
from app.crud import location as crud_location

router = APIRouter()

@router.post("/users/location")
def update_location(data: LocationUpdate, db: Session = Depends(get_db)):
    # Cập nhật vị trí vào Redis
    redis_client.geoadd("user_locations", (data.lng, data.lat, str(data.account_id)))

    # Cập nhật vị trí vào PostgreSQL (PostGIS)
    crud_location.upsert_user_location(db, data.account_id, data.lat, data.lng)

    return {"message": "Đã cập nhật vị trí"}

@router.get("/users/nearby")
def get_nearby_users(account_id: int, radius_km: float = 10, db: Session = Depends(get_db)):
    # Lấy vị trí của người dùng từ Redis
    pos = redis_client.geopos("user_locations", str(account_id))
    if not pos or pos[0] is None:
        return {"message": "Không tìm thấy vị trí người dùng"}

    lng, lat = pos[0]

    # Tìm các account_id gần đó
    nearby_ids = redis_client.geosearch(
        "user_locations",
        longitude=lng,
        latitude=lat,
        radius=radius_km,
        unit="km",
        count=100
    )

    # Loại bỏ chính bản thân
    nearby_ids = [int(uid) for uid in nearby_ids if int(uid) != account_id]

    # Lấy thông tin chi tiết từ database
    result = crud_location.get_nearby_user_profiles(db, nearby_ids)

    return {"nearby_users": result}

