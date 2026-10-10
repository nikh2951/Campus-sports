# Campus Sports Management System - Frontend

Modern, responsive web interface for the Campus Sports Management System, built with React, Vite, Axios, and React Router DOM.

## 🚀 Technology Stack
- **Framework**: React.js (v18+)
- **Build Tool**: Vite
- **Routing**: React Router DOM (v6+)
- **HTTP Client**: Axios
- **Authentication**: `@react-oauth/google` (Google OAuth 2.0 Sign-In)
- **Icons**: Lucide React
- **Styling**: Vanilla Modern CSS (Glassmorphism & Responsive Layout)

## 📋 Repository Structure
```
Campus-sports_frontend/
├── public/                 # Static assets (favicons, SVG icons)
├── src/
│   ├── assets/             # Brand logos & media
│   ├── components/         # Reusable UI components (Navbar, Sidebar, QR Modals)
│   ├── context/            # AuthContext & State management
│   ├── pages/              # Admin & Student application pages
│   ├── services/           # Axios API service layer (api.js)
│   ├── App.jsx             # Main router & layout configuration
│   ├── index.css           # Global design system & theme tokens
│   └── main.jsx            # React root & Google OAuth provider
├── .env.example            # Environment configuration template
├── .gitignore              # Git ignore rules
├── index.html              # HTML entry point
├── package.json            # Node project configuration & dependencies
├── vite.config.js          # Vite configuration
└── README.md
```

## ⚙️ Environment Variables
Create a `.env` file in the project root based on `.env.example`:

| Variable | Description | Example / Default |
| :--- | :--- | :--- |
| `VITE_GOOGLE_CLIENT_ID` | Google Cloud OAuth 2.0 Client ID | `your-client-id.apps.googleusercontent.com` |
| `VITE_API_BASE_URL` | Backend Spring Boot API Base URL | `https://campus-sports-production.up.railway.app/api` |

*Note: In production builds, `VITE_API_BASE_URL` automatically falls back to the deployed production backend if unset, ensuring zero unintended localhost requests.*

## 🛠️ Development & Build

### Install Dependencies
```bash
npm install
```

### Run Locally
```bash
npm run dev
```
Accessible at `http://localhost:5173`.

### Production Build
```bash
npm run build
```
Generates the production-optimized static bundle in `dist/`.

## 🌐 Production Deployment (Vercel)
The application is configured to deploy directly to Vercel:
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Environment Variables**: Configure `VITE_GOOGLE_CLIENT_ID` and `VITE_API_BASE_URL` in the Vercel Project Settings.
