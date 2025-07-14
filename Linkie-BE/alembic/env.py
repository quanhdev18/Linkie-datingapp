import os
import sys
from logging.config import fileConfig

from sqlalchemy import create_engine, pool
from alembic import context

# --- NEW: Load từ .env
from dotenv import load_dotenv
load_dotenv()

# --- NEW: Thêm đường dẫn để import app/
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

# --- Alembic config
config = context.config

# Logging setup
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# --- NEW: Import Base và models
from app.core.database import Base
from app import models  # Import models để metadata có đầy đủ bảng

# --- NEW: Sử dụng Base metadata
target_metadata = Base.metadata

# --- NEW: Lấy DATABASE_URL từ biến môi trường
DATABASE_URL = os.getenv("DATABASE_URL")


def run_migrations_offline() -> None:
    """Chạy migration ở chế độ offline (không cần engine thực tế)"""
    context.configure(
        url=DATABASE_URL,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    """Chạy migration ở chế độ online (có kết nối thật tới DB)"""
    connectable = create_engine(
        DATABASE_URL,
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
            compare_type=True  # 🔁 Để Alembic detect đổi kiểu cột
        )

        with context.begin_transaction():
            context.run_migrations()


# Chạy tương ứng theo chế độ
if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
