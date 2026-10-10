# Campus Sports Management System - Backend API

Robust REST API service for the Campus Sports Management System, built with Java 21, Spring Boot 4.1.1, Spring Data JPA, Hibernate, and MySQL.

## 🚀 Technology Stack
- **Language**: Java 21 (LTS)
- **Framework**: Spring Boot 4.1.1
- **Persistence**: Spring Data JPA & Hibernate
- **Database**: MySQL 8.x
- **Build Tool**: Maven Wrapper (`mvnw` / `mvnw.cmd`)
- **Authentication**: Google OAuth 2.0 Token Verification & Role Management
- **Deployment**: Railway Nixpacks / Cloud Native

## 📋 Repository Structure
```
Campus-sports_bakend/
├── .mvn/wrapper/           # Maven wrapper binary & properties
├── src/
│   ├── main/
│   │   ├── java/com/campus/sports_management_backend/
│   │   │   ├── config/         # WebConfig & CORS configuration
│   │   │   ├── controller/     # REST Controllers (Auth, Student, Sports, Events, Root/Health)
│   │   │   ├── dto/            # Data Transfer Objects & request models
│   │   │   ├── entity/         # JPA Entities
│   │   │   ├── exception/      # GlobalExceptionHandler & custom exceptions
│   │   │   ├── init/           # DataInitializer for bootstrap seeding
│   │   │   ├── repository/     # Spring Data JPA Repositories
│   │   │   └── service/        # Business logic & Google OAuth verification
│   │   └── resources/
│   │       └── application.properties # Externalized application configuration
│   └── test/               # JUnit 5 integration & unit tests
├── .gitattributes          # Line-ending normalizations
├── .gitignore              # Git ignore rules
├── mvnw                    # Maven wrapper for Linux/macOS
├── mvnw.cmd                # Maven wrapper for Windows
├── nixpacks.toml           # Railway Nixpacks deployment definition
├── pom.xml                 # Maven POM configuration
├── system.properties       # JDK 21 runtime version specification
└── README.md
```

## ⚙️ Environment Variables & Configuration

The application dynamically configures datasource and security settings via environment variables:

| Variable | Description | Default / Local Development |
| :--- | :--- | :--- |
| `PORT` | Web server listening port | `8080` |
| `SPRING_DATASOURCE_URL` | MySQL JDBC connection URL | `jdbc:mysql://${MYSQLHOST:localhost}:${MYSQLPORT:3306}/${MYSQLDATABASE:sports_management}` |
| `SPRING_DATASOURCE_USERNAME` | MySQL database username | `${MYSQLUSER:root}` |
| `SPRING_DATASOURCE_PASSWORD` | MySQL database password | `${MYSQLPASSWORD}` |
| `APP_AUTH_ALLOWED_EMAIL_DOMAIN` | Authorized college email domain | `anurag.edu.in` |
| `GOOGLE_CLIENT_ID` | Server-side Google OAuth Client ID | Configured via environment |

*Note: No database passwords or private credentials are hardcoded into source files.*

## 🛠️ Build and Local Development

### Prerequisites
- Java 21 JDK (`JAVA_HOME` pointing to JDK 21)
- MySQL 8.x instance running locally or on a cloud host

### Run Tests
```powershell
./mvnw.cmd clean test
```

### Run Locally
```powershell
# Windows PowerShell
$env:SPRING_DATASOURCE_PASSWORD="your_mysql_password"
./mvnw.cmd spring-boot:run
```

```bash
# Linux / macOS
export SPRING_DATASOURCE_PASSWORD="your_mysql_password"
./mvnw spring-boot:run
```

## 🌐 Railway Cloud Deployment
This repository is configured to deploy directly from its root on Railway:
- **Build Command**: `./mvnw clean package -DskipTests`
- **Start Command**: `java -jar target/sports-management-backend-0.0.1-SNAPSHOT.jar`
- **Health Check Endpoint**: `/api/health`
