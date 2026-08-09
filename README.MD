# ⚽ Westcubes League

### A modern full-stack sports league management platform for fixtures, match progression, team rosters, and real-time league standings.

**Westcubes League** is a full-stack sports management platform designed to digitize the administration and public tracking of a football league.

The platform provides a centralized system for managing teams, players, fixtures, match results, match progression, and league standings while providing supporters with a responsive interface for following the competition.

---

## 🌐 Live Demo

### Frontend

**[View Westcubes League](https://softontechsolution.github.io/westcubes-league/)**

### Architecture

```text
                    ┌──────────────────────┐
                    │       Users          │
                    │ Supporters / Admins  │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │   React + Vite       │
                    │    Frontend          │
                    └──────────┬───────────┘
                               │
                               │ REST API
                               ▼
                    ┌──────────────────────┐
                    │      FastAPI         │
                    │     Backend API      │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │     SQLAlchemy       │
                    │         ORM          │
                    └──────────┬───────────┘
                               │
                    ┌──────────┴───────────┐
                    ▼                      ▼
             ┌─────────────┐       ┌─────────────┐
             │ PostgreSQL  │       │   SQLite    │
             │   Neon      │       │ Development │
             └─────────────┘       └─────────────┘
```

---

# 🎯 Project Overview

Managing a football league involves more than simply displaying match scores.

League administrators need to manage:

* Teams
* Players
* Squads
* Fixtures
* Match states
* Goals
* Results
* League standings
* Competition progression

Westcubes League was built to bring these processes into a centralized digital platform while giving supporters a simple way to follow the competition.

---

# ✨ Key Features

## 🏟️ Match Center

The Match Center provides a centralized view of league fixtures and match progression.

It supports match states including:

* 🟢 Live
* 🟡 Scheduled
* 🔵 Finished

Match information can be refreshed to reflect changes in the current fixture.

---

## ⚽ Match Progression

The platform supports the progression of matches from scheduled fixtures through completion.

```text
Scheduled
    ↓
Live
    ↓
Goals / Match Updates
    ↓
Finished
    ↓
League Table Updated
```

This creates a connected relationship between match results and competition standings.

---

## 🏆 League Standings

The platform calculates and displays league standings based on competition results.

Standings can represent:

* Played matches
* Wins
* Draws
* Losses
* Goals scored
* Goals conceded
* Goal difference
* Points

The league table provides supporters with an immediate overview of the competition.

---

## 👥 Squad Management

Teams have dedicated squad information containing:

* Player names
* Player profiles
* Positions
* Squad numbers
* Team association

This creates a structured digital representation of participating teams.

---

## 📱 Responsive Dashboard

The interface follows a mobile-first approach and is optimized for:

* Smartphones
* Tablets
* Laptops
* Desktop displays

The objective is to ensure that supporters can access league information regardless of their device.

---

# 🛠️ Technology Stack

## Frontend

| Technology   | Purpose                 |
| ------------ | ----------------------- |
| React        | UI development          |
| Vite         | Frontend build tooling  |
| Tailwind CSS | Styling & responsive UI |
| JavaScript   | Application logic       |
| GitHub Pages | Frontend deployment     |

## Backend

| Technology | Purpose                 |
| ---------- | ----------------------- |
| Python     | Backend development     |
| FastAPI    | REST API framework      |
| SQLAlchemy | Database ORM            |
| Pydantic   | Data validation         |
| Uvicorn    | ASGI application server |
| Render     | Backend deployment      |

## Database

| Database        | Purpose                        |
| --------------- | ------------------------------ |
| Neon PostgreSQL | Production/serverless database |
| SQLite          | Local development              |

---

# 🧩 Backend Architecture

The backend is implemented as a RESTful FastAPI service.

```text
backend/
│
├── main.py
│   └── Application entry point
│
├── database.py
│   └── Database engine & sessions
│
├── models.py
│   └── SQLAlchemy database models
│
├── schemas.py
│   └── Pydantic validation schemas
│
└── requirements.txt
    └── Python dependencies
```

The separation of application logic, database models, database configuration, and validation schemas keeps the backend organized and easier to extend.

---

# 🎨 Frontend Architecture

The frontend is implemented using React and Vite.

```text
frontend/
│
├── src/
│   ├── components/
│   │   └── Reusable UI components
│   │
│   ├── App.jsx
│   │   └── Root application
│   │
│   └── main.jsx
│       └── React entry point
│
├── vite.config.js
│   └── Vite configuration
│
└── package.json
    └── Node dependencies & scripts
```

The frontend communicates with the FastAPI backend through REST API requests.

---

# 🔄 Data Flow

A typical match update follows this architecture:

```text
League Data
     ↓
FastAPI Endpoint
     ↓
Pydantic Validation
     ↓
SQLAlchemy
     ↓
Database
     ↓
REST API Response
     ↓
React Frontend
     ↓
User Interface
```

This separation allows the frontend and backend to evolve independently.

---

# 🗄️ Database Strategy

Westcubes League uses a flexible database configuration that supports different environments.

### Production

```text
Neon PostgreSQL
```

### Local Development

```text
SQLite
```

The database driver can be configured through environment variables.

If a production `DATABASE_URL` is available, the application connects to the configured PostgreSQL database.

Otherwise, the application can use a local SQLite database for development.

This approach makes local development lightweight while allowing the application to use a production-grade relational database.

---

# 📂 Project Structure

```text
westcubes-league/
│
├── backend/
│   ├── main.py
│   ├── database.py
│   ├── models.py
│   ├── schemas.py
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── vite.config.js
│   └── package.json
│
└── README.md
```

---

# ⚙️ Getting Started

## Prerequisites

Make sure you have installed:

* Node.js 18+
* Python 3.10+
* Git

---

## 1. Clone the Repository

```bash
git clone https://github.com/softontechsolution/westcubes-league.git

cd westcubes-league
```

---

# 🐍 2. Backend Setup

Navigate to the backend:

```bash
cd backend
```

Create a Python virtual environment:

```bash
python3 -m venv venv
```

Activate it.

### macOS / Linux

```bash
source venv/bin/activate
```

### Windows

```bash
venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Start the FastAPI development server:

```bash
uvicorn main:app --reload
```

The API will be available at:

```text
http://127.0.0.1:8000
```

FastAPI's interactive API documentation can be accessed at:

```text
http://127.0.0.1:8000/docs
```

---

# ⚛️ 3. Frontend Setup

Open another terminal.

Navigate to the frontend:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend will be available at:

```text
http://localhost:5173
```

---

# 🔐 Environment Variables

For production PostgreSQL connectivity, configure the backend environment:

```env
DATABASE_URL=postgresql://user:password@host:port/database_name
```

If `DATABASE_URL` is not provided, the application can fall back to:

```text
sqlite:///./westcubes_league.db
```

### Security

Never commit credentials, passwords, database URLs containing secrets, or private API keys to GitHub.

Use environment variables for sensitive configuration.

---

# 🚀 Deployment

## Backend — Render

The FastAPI backend can be deployed as a Render Web Service.

### Build Command

```bash
pip install -r backend/requirements.txt
```

### Start Command

```bash
uvicorn backend.main:app --host 0.0.0.0 --port $PORT
```

Configure the production database under Render's environment variables.

---

## Frontend — GitHub Pages

The React/Vite frontend is deployed through GitHub Pages.

Build and deploy:

```bash
cd frontend

npm run deploy
```

Live application:

**https://softontechsolution.github.io/westcubes-league/**

---

# 📦 Deployment Architecture

```text
                    GitHub Repository
                           │
              ┌────────────┴────────────┐
              │                         │
              ▼                         ▼
       GitHub Pages                  Render
              │                         │
              ▼                         ▼
       React Frontend              FastAPI API
                                        │
                                        ▼
                                  Neon PostgreSQL
```

---

# 🧠 Engineering Concepts Demonstrated

Westcubes League demonstrates practical experience with:

* Full-stack application architecture
* REST API development
* React application development
* FastAPI backend development
* SQLAlchemy ORM
* PostgreSQL
* SQLite
* Pydantic validation
* API integration
* Environment configuration
* Responsive UI development
* Cloud deployment
* GitHub Pages
* Render
* Database abstraction
* Separation of frontend and backend services

---

# 📈 Possible Future Improvements

Potential future iterations could include:

* 🔔 Push notifications
* 📱 Progressive Web App support
* 🏟️ Match event timeline
* 📊 Advanced league statistics
* ⚽ Player performance analytics
* 🏆 Tournament management
* 🔴 Live match commentary
* 🔐 Admin authentication
* 🖼️ Team logos and player photos
* 📈 Historical season statistics
* 📲 Mobile application
* 🔌 Real-time WebSocket updates

---

# 📸 Screenshots

Screenshots can be added here to showcase:

### League Dashboard

*Add screenshot here*

### Match Center

*Add screenshot here*

### League Standings

*Add screenshot here*

### Team Squad

*Add screenshot here*

---

# 📄 License

This project is proprietary software developed by **Softon Tech Solution**.

All rights reserved.

---

# 👨‍💻 Author

## Emmanuel Joshua

**Software Developer • Solution Architect • Digital Transformation Strategist**

🌐 **Portfolio:**
https://softontechsolution.github.io/

💻 **GitHub:**
https://github.com/softontechsolution

---

<p align="center">
  <b>Westcubes League</b>
  <br/>
  A digital home for fixtures, teams, matches and league standings.
  <br/><br/>
  ⭐ Star the repository if you find the project interesting.
</p>
