# from sqlalchemy.ext.asyncio import AsyncSession
# from sqlalchemy import text
# from datetime import datetime

# async def upsert_user_location(db: AsyncSession, account_id: int, lat: float, lng: float):
#     await db.execute(text("""
#         INSERT INTO user_locations (account_id, location, last_updated)
#         VALUES (:account_id, ST_SetSRID(ST_MakePoint(:lng, :lat), 4326), :now)
#         ON CONFLICT (account_id) DO UPDATE SET
#         location = EXCLUDED.location,
#         last_updated = EXCLUDED.last_updated
#     """), {"account_id": account_id, "lat": lat, "lng": lng, "now": datetime.utcnow()})
#     await db.commit()

# async def get_nearby_user_profiles(db: AsyncSession, account_ids: list[int]):
#     if not account_ids:
#         return []

#     placeholders = ", ".join(f":uid{i}" for i in range(len(account_ids)))
#     params = {f"uid{i}": uid for i, uid in enumerate(account_ids)}

#     query = text(f"""
#         SELECT a.id, a.email, a.phone_number
#         FROM account a
#         WHERE a.id IN ({placeholders})
#         ORDER BY a.id
#     """)
#     result = await db.execute(query, params)
#     rows = result.fetchall()
#     columns = result.keys()
#     return [dict(zip(columns, row)) for row in rows]


# from sqlalchemy.ext.asyncio import AsyncSession
# from sqlalchemy import text
# from datetime import datetime

# async def upsert_user_location(db: AsyncSession, account_id: int, lat: float, lng: float):
#     await db.execute(text("""
#         INSERT INTO user_locations (account_id, location, last_updated)
#         VALUES (:account_id, ST_SetSRID(ST_MakePoint(:lng, :lat), 4326), :now)
#         ON CONFLICT (account_id) DO UPDATE SET
#             location = EXCLUDED.location,
#             last_updated = EXCLUDED.last_updated
#     """), {"account_id": account_id, "lat": lat, "lng": lng, "now": datetime.utcnow()})
#     await db.commit()

# async def get_nearby_user_profiles(db: AsyncSession, account_ids: list[int]):
#     if not account_ids:
#         return []

#     placeholders = ", ".join(f":uid{i}" for i in range(len(account_ids)))
#     params = {f"uid{i}": uid for i, uid in enumerate(account_ids)}

#     query = text(f"""
#         SELECT a.id, a.email, a.phone_number
#         FROM account a
#         WHERE a.id IN ({placeholders})
#         ORDER BY a.id
#     """)

#     result = await db.execute(query, params)
#     rows = result.all()  
#     columns = result.keys()
#     return [dict(zip(columns, row)) for row in rows]

# from sqlalchemy.orm import Session
# from sqlalchemy import text
# from datetime import datetime

# def upsert_user_location(db: Session, account_id: int, lat: float, lng: float):
#     query = text("""
#         INSERT INTO user_locations (account_id, location, last_updated)
#         VALUES (:account_id, ST_SetSRID(ST_MakePoint(:lng, :lat), 4326), :now)
#         ON CONFLICT (account_id) DO UPDATE SET
#         location = EXCLUDED.location,
#         last_updated = EXCLUDED.last_updated
#     """)
#     db.execute(query, {
#         "account_id": account_id,
#         "lat": lat,
#         "lng": lng,
#         "now": datetime.utcnow()
#     })
#     db.commit()

# def get_nearby_user_profiles(db: Session, account_ids: list[int]):
#     if not account_ids:
#         return []

#     placeholders = ", ".join(f":uid{i}" for i in range(len(account_ids)))
#     params = {f"uid{i}": uid for i, uid in enumerate(account_ids)}

#     query = text(f"""
#         SELECT a.id, a.email, a.phone_number
#         FROM account a
#         WHERE a.id IN ({placeholders})
#         ORDER BY a.id
#     """)

#     result = db.execute(query, params)
#     rows = result.fetchall()
#     columns = result.keys()
#     return [dict(zip(columns, row)) for row in rows]

# app/crud/location.py
from sqlalchemy.orm import Session
from sqlalchemy import text
from datetime import datetime

def upsert_user_location(db: Session, account_id: int, lat: float, lng: float):
    query = text("""
        INSERT INTO user_locations (account_id, location, last_updated)
        VALUES (:account_id, ST_SetSRID(ST_MakePoint(:lng, :lat), 4326), :now)
        ON CONFLICT (account_id) DO UPDATE SET
            location = EXCLUDED.location,
            last_updated = EXCLUDED.last_updated
    """)
    db.execute(query, {
        "account_id": account_id,
        "lat": lat,
        "lng": lng,
        "now": datetime.utcnow()
    })
    db.commit()

def get_nearby_user_profiles(db: Session, account_ids: list[int]):
    if not account_ids:
        return []

    placeholders = ", ".join(f":uid{i}" for i in range(len(account_ids)))
    params = {f"uid{i}": uid for i, uid in enumerate(account_ids)}

    query = text(f"""
        SELECT a.id, a.email, a.phone
        FROM account a
        WHERE a.id IN ({placeholders})
        ORDER BY a.id
    """)

    result = db.execute(query, params)
    rows = result.fetchall()
    columns = result.keys()
    return [dict(zip(columns, row)) for row in rows]
