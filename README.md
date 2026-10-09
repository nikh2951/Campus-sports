# Campus Sports Management System

A complete, full-stack university sports management platform built with **React.js**, **Java 21**, **Spring Boot 4.1.1**, and **MySQL 8.x**.

---

## 🌟 Approved College Email Policy & Domain

- **Official Approved Email Domain**: `@anurag.edu.in`
- **Centralized Backend Config Property**: `app.auth.allowed-email-domain=anurag.edu.in`
- **Domain Policy Rules**:
  - Registration requires an authenticated Google account with a verified email ending in `@anurag.edu.in`.
  - Personal Gmail addresses (`student@gmail.com`), lookalike domains (`student@anurag.edu.in.example`), and unapproved domains are rejected by both frontend and Spring Boot backend validators.
  - Student registration pre-fills and locks the verified `@anurag.edu.in` email from Google authentication.

---

## 🔑 Google OAuth 2.0 Configuration

### Local Development Origin
- **Authorized JavaScript Origin**: `http://localhost:5173`

### Environment Variables & Settings
1. **Frontend Configuration (`frontend/.env`)**:
   ```env
   VITE_GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com
   ```
2. **Backend Configuration (`application.properties`)**:
   ```properties
   app.auth.allowed-email-domain=anurag.edu.in
   app.auth.google-client-id=${GOOGLE_CLIENT_ID:}
   ```

### ⚠️ Distinguishing Authentication & Configuration Errors
- **OAuth Configuration Error**: Occurs when `VITE_GOOGLE_CLIENT_ID` is missing, invalid, or unconfigured in Google Cloud Console (`invalid_client` or 401 error). Displayed as a **Google OAuth Configuration Alert**.
- **College Email Domain Validation Error**: Occurs when a user successfully authenticates with Google using an unapproved email domain (e.g. `user@gmail.com`). Displayed as: `"Please sign in using your verified @anurag.edu.in college account."`

---

## 🚀 Running the Application Locally

### 1. Start Spring Boot Backend
```cmd
cd backend\sports-management-backend\sports-management-backend
set JAVA_HOME=C:\Program Files\Java\jdk-21.0.11
mvnw.cmd spring-boot:run
```
The Spring Boot backend REST server runs at **`http://localhost:8080/api`**.

### 2. Start React Frontend Dev Server
```cmd
cd frontend
npm run dev
```
The React frontend application runs at **`http://localhost:5173/`**.

---

## 🛡️ Default Administrator Credentials
- **Default Admin ID**: `ADM001`
- **Authorized Admin Email**: `admin@anurag.edu.in`
