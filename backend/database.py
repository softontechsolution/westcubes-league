import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# 1. Look for production environment variable, otherwise fall back to local SQLite
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./westcubes_league.db")

# 2. Fix compatibility quirk: Cloud providers sometimes give "postgres://", 
# but SQLAlchemy strictly requires "postgresql://"
if SQLALCHEMY_DATABASE_URL and SQLALCHEMY_DATABASE_URL.startswith("postgres://"):
    SQLALCHEMY_DATABASE_URL = SQLALCHEMY_DATABASE_URL.replace("postgres://", "postgresql://", 1)

# 3. SQLite requires check_same_thread, but PostgreSQL rejects it. 
# We apply engine creation dynamically based on the active database driver.
if SQLALCHEMY_DATABASE_URL.startswith("sqlite"):
    engine = create_engine(
        SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
    )
else:
    engine = create_engine(SQLALCHEMY_DATABASE_URL)

# This creates a temporary "workspace" for our database transactions
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# All our models will inherit from this Base class
Base = declarative_base()

# Standard dependency injection helper for FastAPI routes
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()