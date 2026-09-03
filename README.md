# Notes Space — Full-Stack Real-Time Workspace

Notes Space is a production-ready note-taking application designed for speed, security, and seamless synchronization. This project demonstrates a complete architecture like Node.js, React, and PostgreSQL with a focus on high code quality and engineering standards.

## Key Features

* Secure Gateway: User authentication powered by JWT tokens and 12-round salted Bcrypt hashing.
* Rich Text Editor: A professional authoring environment using React-Quill for formatted notes.
* Live Synchronization: Real-time updates via Socket.IO that keep your dashboard in sync across multiple tabs.
* Data Portability: Human-readable export and import system for .txt files, compatible with standard text editors like Notepad.
* Advanced Search: Fast, case-insensitive keyword filtering using PostgreSQL ILIKE logic.
* Persistent Analytics: A real-time "Deleted Notes" counter that tracks your session history permanently in the database.
* Adaptive UI: A modern, high-contrast interface built with a mobile-first approach for all screen sizes.

## Technology Stack

Frontend
* React.js with Vite for high-performance development.
* Tailwind CSS v4 for utility-first, responsive styling.
* GSAP and Framer Motion for smooth animations and transitions.
* Socket.IO Client for real-time event handling.

Backend
* Node.js and Express.js for a scalable RESTful API.
* PostgreSQL via Supabase for reliable relational data storage.
* Pino for high-performance structured logging and request tracing.
* Joi for strict input validation and data integrity.

## Folder Structure

repository-root/
├── .github/workflows/ 
├── backend/           
│   ├── sql/           
│   ├── src/            
│   └── test/           
├── frontend/           
│   ├── src/                   
└── SonarQubeReport/   

## Local Setup Instructions

1. Database Configuration
* Create a project on Supabase.
* Run the SQL scripts provided in backend/sql/ to create the users and notes tables.
* Enable Row Level Security (RLS) using the provided rls_policies.sql.

2. Backend Setup
* Navigate to the backend directory: cd backend
* Install dependencies: npm install
* Create a .env file and add:
  PORT=5000
  DATABASE_URL= (Your Supabase connection string)
  JWT_SECRET= (A secure random string)
* Start the server: npm run dev

3. Frontend Setup
* Navigate to the frontend directory: cd frontend
* Install dependencies: npm install
* Create a .env file and add:
  VITE_API_BASE_URL=http://localhost:5000/api
* Start the application: npm run dev

## Quality and Testing

The codebase follows a "Test-First" philosophy to ensure long-term maintainability:
* Backend: Verified with Mocha and Chai, covering CRUD operations, security boundaries, and atomic transactions.
* Frontend: Verified with Jest, focusing on component accessibility, state management, and real-time socket events.
* Static Analysis: Integrated with SonarCloud via GitHub Actions.
* Audit Status: Passed Quality Gate with 87% logic coverage.

## Security Implementation

* Database Hardening: Implemented Row Level Security (RLS) to enforce data ownership at the SQL level.
* Data Protection: Automatic sanitization of user sessions in browser storage to prevent data injection.
* Privacy: Strict field projection in APIs to ensure sensitive data (like password hashes) is never leaked.
* Infrastructure: Secured CORS policies and hidden server version headers for production readiness.

---
Developed by Ali Nisar
Cohort 9 MERN Project