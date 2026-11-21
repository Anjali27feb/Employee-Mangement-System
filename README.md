# Employee Management System (EMS)
A full-stack Employee Management System built using **Java, Spring Boot, Spring Security, JWT Authentication, MySQL, HTML, CSS, and JavaScript**.
The application allows users to register and log in securely and manage employee records through a dashboard.

## Features
- User Registration and Login
- JWT-based Authentication
- Secure Password Encryption using BCrypt
- Add, View, Update and Delete Employees
- Search Employees by Name and Department
- Pagination and Sorting
- Employee Dashboard with Statistics
- RESTful APIs
- Swagger API Documentation
- MySQL Database Integration

## Tech Stack
**Backend**
- Java 26
- Spring Boot 3.5.4
- Spring Security
- JWT
- Spring Data JPA
- Hibernate
- Maven

**Frontend**
- HTML5
- CSS3
- JavaScript

**Database**
- MySQL

**Tools**
- VS Code
- Postman
- Swagger UI
- Git and GitHub

## Project Setup
### 1. Prerequisites

Install the following before running the application:
- Java JDK 26
- MySQL Server
- Visual Studio Code
- Git
- VS Code Live Server extension

Verify Java installation:

```bash
java -version
```

### 2. Clone the Repository
```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

Navigate to the project directory:
```bash
cd Employee-Management-System
```

### 3. Create MySQL Database
Open MySQL Workbench or MySQL Command Line Client and execute:
```sql
CREATE DATABASE ems;
```

### 4. Configure Database Credentials

Open:
`src/main/resources/application.properties`

The database configuration should look like this:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/ems
spring.datasource.username=${DB_USERNAME}
spring.datasource.password=${DB_PASSWORD}

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true

springdoc.api-docs.path=/api-docs
springdoc.swagger-ui.path=/swagger-ui.html

jwt.secret=${JWT_SECRET}
```

Do not replace the placeholders with your actual credentials.

### 5. Configure Environment Variables

The application uses environment variables to protect database credentials and the JWT secret.

Open a **PowerShell terminal in the project root directory**.

Set your own MySQL username and password:

```powershell
$env:DB_USERNAME="your_mysql_username"
$env:DB_PASSWORD="your_mysql_password"
```

Generate a secure Base64-encoded JWT secret:

```powershell
$bytes = New-Object byte[] 32
$rng = [System.Security.Cryptography.RandomNumberGenerator]::Create()
$rng.GetBytes($bytes)
$JWT_SECRET = [Convert]::ToBase64String($bytes)
$rng.Dispose()
```

Set the generated secret:

```powershell
$env:JWT_SECRET = $JWT_SECRET
```

Verify that the variables are configured without displaying their values:

```powershell
if ($env:DB_USERNAME -and $env:DB_PASSWORD -and $env:JWT_SECRET) {
    Write-Host "All environment variables are configured."
}
```

**Important:** Keep the same PowerShell terminal open while running the backend. Environment variables configured this way are temporary and apply only to that terminal session.

### 6. Run the Spring Boot Backend

From the project root directory, run:

```powershell
.\mvnw.cmd spring-boot:run
```

The backend will start at:

`http://localhost:8080`

Wait until the terminal displays:

`Started EmployeeManagementSystemApplication`

### 7. Open Swagger UI

Open the following URL in your browser:

`http://localhost:8080/swagger-ui/index.html`

You can use Swagger UI to test the REST APIs.

### 8. Run the Frontend

1. Open the project in VS Code.
2. Open the `frontend` folder.
3. Right-click `index.html`.
4. Select **Open with Live Server**.
5. Register a new account and log in.
6. After successful login, the dashboard will open.

The frontend typically runs at:

`http://127.0.0.1:5500`

Make sure the backend is running before using the frontend.

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/register` | Register a new user |
| POST | `/auth/login` | Authenticate user |
| POST | `/employees` | Add employee |
| GET | `/employees` | Get employees with pagination |
| GET | `/employees/{id}` | Get employee by ID |
| PUT | `/employees/{id}` | Update employee |
| DELETE | `/employees/{id}` | Delete employee |
| GET | `/employees/search/name` | Search by name |
| GET | `/employees/search/department` | Search by department |

Employee endpoints require a valid JWT token.

## Troubleshooting

**1. Database connection error**

- Make sure MySQL Server is running.
- Verify your database username and password.
- Confirm that the `ems` database exists.
- Check that your environment variables are configured in the same terminal.

**2. JWT secret error**

- Generate a new Base64-encoded secret.
- Ensure that `JWT_SECRET` is set in the PowerShell terminal.
- Restart the backend after configuring it.

**3. Port 8080 already in use**

Stop the other application using port 8080 before starting Spring Boot.

**4. Frontend API or CORS error**

- Make sure the backend is running.
- Open the frontend using Live Server.
- Check that the frontend origin is allowed in the backend CORS configuration.

## Security Notes

- Never commit database passwords or JWT secrets to GitHub.
- Never share your generated JWT secret.
- Each developer should generate their own JWT secret.
- Do not upload local environment files containing credentials.
- Use HTTPS and appropriate production security settings before deployment.

## Author

Developed as a full-stack project to demonstrate backend development, REST API design, database integration, authentication, and frontend development.

