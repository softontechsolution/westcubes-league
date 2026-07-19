Westcubes League Management System
Westcubes League is a full-stack, real-time football management platform designed to provide a seamless Match Center for fans and an administrative hub for league operators. The application features live score polling, dynamic standings calculation, role-based access control, and a visual match event timeline.

🚀 Key Features
Real-time Match Center: Automatic 30-second polling to keep scores and statuses updated without page refreshes.

Dynamic Standings Matrix: Server-side logic that calculates points, goal differences, and rankings based on match outcomes.

Role-Based Access Control (RBAC): Distinct administrative and public interfaces. Admins have full CRUD capabilities for teams, players, and match events.

Visual Event Timeline: A LiveScore-inspired event visualization component that renders goals, assists, and match milestones (HT/FT) chronologically.

Production-Ready Architecture: decoupled frontend/backend setup with support for cloud-hosted databases.

🏗️ Technical Stack
Frontend
Framework: React (Vite)

Styling: Tailwind CSS

State Management: React useState & useEffect hooks

Routing: React Router v6

Backend
Language: Python (FastAPI)

ORM: SQLAlchemy

Database: PostgreSQL (Neon.tech) / SQLite (Local Dev)

API Protocol: RESTful

🛠️ Getting Started
Prerequisites
Node.js (v20+)

Python (v3.10+)

Git

Local Development Setup
Clone the repository:

Bash
git clone https://github.com/your-username/westcubes-league.git
cd westcubes-league
Backend Setup:

Bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
Frontend Setup:

Bash
cd ../frontend
npm install
npm run dev
🔐 Environment Configuration
To switch between development and production, utilize the .env files located in the frontend root:

Development: .env.development

Code snippet
VITE_API_BASE_URL=http://localhost:8000
Production: .env.production

Code snippet
VITE_API_BASE_URL=https://your-backend-api-url.onrender.com
🚀 Deployment Pipeline
Backend (Render)
Push the backend code to a GitHub repository.

Link the repository to Render as a "Web Service".

Set Environment Variable DATABASE_URL using your Neon PostgreSQL connection string.

Deployment will automatically build using pip install -r requirements.txt.

Frontend (GitHub Pages)
Ensure vite.config.js includes your repo base path.

Install gh-pages and update package.json with the deploy script:

JSON
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d dist"
}
Run npm run deploy to push the static production build.

📝 Architecture Notes
Database Persistence: We utilize Neon (Postgres) for cloud-hosted database persistence, ensuring data integrity across Render server restarts.

CORS Management: The FastAPI backend is configured with CORSMiddleware to allow specific cross-origin requests from the GitHub Pages-hosted frontend domain, maintaining security while enabling connectivity.

Performance: The dashboard uses Promise-based fetching (Promise.all) to load dependencies (teams, players, matches) in parallel, minimizing Time-to-Interactive (TTI).

🤝 Contribution Guidelines
Fork the repository.

Create a feature branch (git checkout -b feature/amazing-feature).

Commit your changes (git commit -m 'feat: added new match event type').

Push to the branch (git push origin feature/amazing-feature).

Open a Pull Request.

Built with ❤️ for Westcubes League.