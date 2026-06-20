from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# The local database file. 
# For production/investors, this swaps to a PostgreSQL URL: "postgresql://user:pass@localhost/db"
SQLALCHEMY_DATABASE_URL = "sqlite:///./westcubes_league.db"

# connect_args is needed only for SQLite to allow multiple threads
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)

# This creates a temporary "workspace" for our database transactions
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# All our models will inherit from this Base class
Base = declarative_base()