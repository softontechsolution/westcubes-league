from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

class Team(Base):
    __tablename__ = "teams"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True, nullable=False)
    manager_name = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships to access team data
    players = relationship("Player", back_populates="team", cascade="all, delete-orphan")
    # Link home/away matches so the team knows all its games
    home_matches = relationship("Match", foreign_keys="[Match.home_team_id]", back_populates="home_team", cascade="all, delete-orphan")
    away_matches = relationship("Match", foreign_keys="[Match.away_team_id]", back_populates="away_team", cascade="all, delete-orphan")

class Player(Base):
    __tablename__ = "players"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    position = Column(String)
    squad_number = Column(Integer)
    
    # Foreign Key links player to a specific team
    team_id = Column(Integer, ForeignKey("teams.id"))
    team = relationship("Team", back_populates="players")

class Match(Base):
    __tablename__ = "matches"

    id = Column(Integer, primary_key=True, index=True)
    # Foreign Keys link to the teams table
    home_team_id = Column(Integer, ForeignKey("teams.id"))
    away_team_id = Column(Integer, ForeignKey("teams.id"))
    
    # Standardized names: match these with your Pydantic schemas
    home_goals = Column(Integer, default=0)
    away_goals = Column(Integer, default=0)
    status = Column(String, default="Scheduled") 

    # Relationships link to the Team model for easy access to team objects
    home_team = relationship("Team", foreign_keys=[home_team_id], back_populates="home_matches")
    away_team = relationship("Team", foreign_keys=[away_team_id], back_populates="away_matches")