<div align="center">

# 📦 AssetHub

### A Modern Asset Management Platform for Smarter Tracking, Organization, and Control

AssetHub is a full-stack asset management platform designed to simplify the way organizations manage, monitor, assign, and maintain their assets. It provides a centralized and intuitive dashboard for tracking asset information, managing users, monitoring asset status, and maintaining organized digital records.

Built using **React, TypeScript, Node.js, Express, and MySQL**, AssetHub follows a scalable client-server architecture with secure authentication and a responsive user experience.

<br />

[![Frontend](https://img.shields.io/badge/Frontend-Vercel-000000?style=for-the-badge\&logo=vercel)](https://asset-hub-five.vercel.app/)
[![Backend](https://img.shields.io/badge/Backend-Render-46E3B7?style=for-the-badge\&logo=render\&logoColor=000000)](https://render.com/)
[![Database](https://img.shields.io/badge/Database-Railway-0B0D0E?style=for-the-badge\&logo=railway)](https://railway.app/)
[![React](https://img.shields.io/badge/React-TypeScript-3178C6?style=for-the-badge\&logo=react)](https://react.dev/)
[![MySQL](https://img.shields.io/badge/MySQL-Database-4479A1?style=for-the-badge\&logo=mysql\&logoColor=white)](https://www.mysql.com/)

<br />

### 🌐 [View Live Application](https://asset-hub-five.vercel.app/)

</div>

---

## ✨ Key Features

### 🔐 Secure Authentication

* User registration and login
* JWT-based authentication
* Secure password handling
* Authentication state management
* Protected application routes
* Persistent user sessions

### 📊 Interactive Dashboard

* Centralized overview of organizational assets
* Asset statistics and summaries
* Quick access to important information
* Clean and responsive dashboard interface

### 📦 Asset Management

* Add and register organizational assets
* View available asset information
* Update existing asset records
* Organize assets using structured data
* Track asset information from a centralized interface

### 👥 User Management

* Maintain authenticated user accounts
* Display user-specific information
* Manage user access through secure authentication
* Support protected user workflows

### 🔎 Search and Navigation

* Fast and intuitive application navigation
* Search functionality for easier data discovery
* Reusable navigation and layout components

### 📱 Responsive User Interface

* Responsive layouts for different screen sizes
* Modern dashboard design
* Reusable React components
* Consistent styling throughout the application

### 🔗 RESTful API Integration

* Organized API routes
* Separation of frontend and backend logic
* Reusable API service layer
* Centralized communication between the React client and Express server

---

## 🛠 Technology Stack

### Frontend

| Technology   | Purpose                                                 |
| ------------ | ------------------------------------------------------- |
| React        | Component-based user interface development              |
| TypeScript   | Static typing and improved code reliability             |
| Vite         | Fast development server and optimized production builds |
| Tailwind CSS | Responsive utility-first styling                        |
| React Router | Client-side routing and navigation                      |
| Axios        | Communication with backend REST APIs                    |
| Lucide React | Modern and customizable application icons               |

### Backend

| Technology | Purpose                                               |
| ---------- | ----------------------------------------------------- |
| Node.js    | JavaScript runtime environment                        |
| Express.js | REST API development and request handling             |
| TypeScript | Type-safe backend development                         |
| MySQL      | Relational data storage                               |
| JWT        | Token-based user authentication                       |
| bcrypt     | Secure password hashing                               |
| dotenv     | Environment variable management                       |
| CORS       | Controlled communication between frontend and backend |

### Deployment

| Service                | Platform       |
| ---------------------- | -------------- |
| Frontend Hosting       | Vercel         |
| Backend Hosting        | Render         |
| MySQL Database Hosting | Railway        |
| Source Code Management | Git and GitHub |

---

## 🏗 System Architecture

```text
┌──────────────────────────────┐
│                              │
│       React Frontend         │
│    TypeScript + Vite UI      │
│                              │
│     Deployed on Vercel       │
│                              │
└──────────────┬───────────────┘
               │
               │ HTTPS / REST API
               │ JSON Requests and Responses
               ▼
┌──────────────────────────────┐
│                              │
│     Node.js + Express API    │
│                              │
│ Authentication               │
│ Business Logic               │
│ Request Validation           │
│ Database Operations          │
│                              │
│      Deployed on Render      │
│                              │
└──────────────┬───────────────┘
               │
               │ MySQL Connection
               ▼
┌──────────────────────────────┐
│                              │
│        MySQL Database        │
│                              │
│ Users                        │
│ Assets                       │
│ Application Records          │
│                              │
│      Hosted on Railway       │
│                              │
└──────────────────────────────┘
```

---

## 📁 Project Structure

```text
AssetHub/
│
├── client/                         # React frontend application
│   │
│   ├── public/                     # Publicly accessible static assets
│   │
│   ├── src/                        # Main frontend source code
│   │   │
│   │   ├── api/                    # API configuration and request services
│   │   │
│   │   ├── components/             # Reusable React UI components
│   │   │
│   │   ├── context/                # Global React context providers
│   │   │
│   │   ├── pages/                  # Route-level application pages
│   │   │
│   │   ├── types/                  # Shared TypeScript interfaces and types
│   │   │
│   │   ├── App.tsx                 # Root application component and routes
│   │   ├── index.css               # Global styles and Tailwind configuration
│   │   └── main.tsx                # React application entry point
│   │
│   ├── .env                        # Frontend environment variables
│   ├── .gitignore                  # Frontend Git exclusion rules
│   ├── eslint.config.js            # ESLint configuration
│   ├── index.html                  # Main HTML template used by Vite
│   ├── package.json                # Frontend dependencies and scripts
│   ├── package-lock.json           # Locked frontend dependency versions
│   ├── tsconfig.app.json           # TypeScript configuration for React
│   ├── tsconfig.json               # Base TypeScript configuration
│   ├── tsconfig.node.json          # TypeScript configuration for Vite
│   └── vite.config.ts              # Vite development and build configuration
│
├── server/                         # Node.js and Express backend
│   │
│   ├── src/                        # Main backend source code
│   │   │
│   │   ├── config/                 # Database and application configuration
│   │   │
│   │   ├── controllers/            # API request handlers and business logic
│   │   │
│   │   ├── middleware/             # Authentication and request middleware
│   │   │
│   │   ├── routes/                 # Express REST API route definitions
│   │   │
│   │   ├── utils/                  # Shared backend utility functions
│   │   │
│   │   └── index.ts                # Express server entry point
│   │
│   ├── .env                        # Backend environment variables
│   ├── package.json                # Backend dependencies and scripts
│   ├── package-lock.json           # Locked backend dependency versions
│   └── tsconfig.json               # Backend TypeScript configuration
│
├── .gitignore                      # Repository-level Git exclusion rules
└── README.md                       # Project documentation
```

## 🚀 Getting Started

Follow the instructions below to run AssetHub locally.

### Prerequisites

Ensure that the following software is installed:

| Requirement | Recommended Version   |
| ----------- | --------------------- |
| Node.js     | 18 or later           |
| npm         | 9 or later            |
| MySQL       | 8 or later            |
| Git         | Latest stable version |

Verify the installations:

```bash
node --version
npm --version
git --version
mysql --version
```

---

## 1. Clone the Repository

```bash
git clone https://github.com/pragya0129/AssetHub.git
```

Move into the project directory:

```bash
cd AssetHub
```

---

## 2. Configure the MySQL Database

Start the MySQL server and log in:

```bash
mysql -u root -p
```

Create the local database:

```sql
CREATE DATABASE assetflow_db;
```

Verify that the database was created:

```sql
SHOW DATABASES;
```

Exit MySQL:

```sql
EXIT;
```

---

## 3. Configure the Backend

Move into the backend directory:

```bash
cd server
```

Install backend dependencies:

```bash
npm install
```

Create a `.env` file inside the `server` directory:

```env
PORT=5000

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=root
DB_NAME=assetflow_db

JWT_SECRET=replace_with_a_long_random_secret
```

> Never commit the `.env` file or expose production database credentials and JWT secrets publicly.

Generate a secure JWT secret using Node.js:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Copy the generated value and use it as `JWT_SECRET`.

Start the backend development server:

```bash
npm run dev
```

The backend should run at:

```text
http://localhost:5000
```

---

## 4. Configure the Frontend

Open another terminal from the project root and move into the frontend directory:

```bash
cd client
```

Install frontend dependencies:

```bash
npm install
```

Create a `.env` file inside the `client` directory:

```env
VITE_API_URL=http://localhost:5000
```

Start the frontend development server:

```bash
npm run dev
```

The frontend will generally be available at:

```text
http://localhost:5173
```

Open the displayed Vite URL in a browser.

---

## ▶️ Running the Application

AssetHub requires the frontend and backend to run simultaneously.

### Terminal 1 — Backend

```bash
cd server
npm install
npm run dev
```

Backend:

```text
http://localhost:5000
```

### Terminal 2 — Frontend

```bash
cd client
npm install
npm run dev
```

Frontend:

```text
http://localhost:5173
```

---

## 📜 Available Scripts

### Frontend

Run the frontend development server:

```bash
npm run dev
```

Create an optimized production build:

```bash
npm run build
```

Run ESLint:

```bash
npm run lint
```

Preview the production build locally:

```bash
npm run preview
```

### Backend

Run the backend in development mode:

```bash
npm run dev
```

Create a production build:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

> Refer to the respective `package.json` files for the exact scripts currently configured in the project.

---

## 🔄 Application Workflow

```text
User
  │
  ▼
React Interface
  │
  │ Sends an HTTP request
  ▼
Backend REST API
  │
  │ Validates authentication
  │ Processes business logic
  ▼
MySQL Database
  │
  │ Returns requested data
  ▼
Express Backend
  │
  │ Returns a JSON response
  ▼
React Frontend
  │
  ▼
Updated User Interface
```

---

## ☁️ Deployment Architecture

### Frontend — Vercel

The React application is deployed using Vercel.

Production frontend:

```text
https://asset-hub-five.vercel.app/
```

The following environment variable is configured in Vercel:

```env
VITE_API_URL=https://your-render-backend-url.onrender.com
```

Vercel automatically:

* Installs frontend dependencies
* Creates the optimized Vite production build
* Hosts static frontend resources
* Provides HTTPS support
* Redeploys the application after updates

---

### Backend — Render

The Node.js and Express backend is deployed using Render.

Render is responsible for:

* Installing backend dependencies
* Building the TypeScript application
* Running the production server
* Providing a public HTTPS API
* Managing backend environment variables

The production backend uses Railway database credentials rather than local MySQL credentials.

---

### Database — Railway

The production MySQL database is hosted using Railway.

Railway provides production values for:

```env
DB_HOST=
DB_PORT=
DB_USER=
DB_PASSWORD=
DB_NAME=
```

These credentials are stored securely as environment variables in Render.

Production database credentials must never be:

* Added to source code
* Committed to GitHub
* Added to the README
* Shared publicly

---

## 🔒 Security Practices

AssetHub follows important application security practices:

* Passwords are securely hashed before database storage.
* JWT tokens are used for authenticated sessions.
* Protected endpoints require valid authentication.
* Sensitive configuration is stored in environment variables.
* Database credentials are excluded from source control.
* Client and server responsibilities are separated.
* CORS controls communication between the frontend and backend.
* Production services communicate using HTTPS.

---

## 🔮 Future Enhancements

Potential improvements for future releases include:

* Asset assignment and return workflows
* Asset maintenance history
* Asset lifecycle management
* QR code and barcode integration
* Role-based access control
* Advanced search and filtering
* Asset usage analytics
* Export reports as CSV or PDF
* Email and in-app notifications
* Asset audit logs
* Department-based asset management
* File and document attachments
* Automated asset status reminders
* Dashboard charts and visual analytics

⭐ If you find this project useful, consider giving the repository a star.

</div>
