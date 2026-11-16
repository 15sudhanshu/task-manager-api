# Task Manager REST API

A RESTful backend for managing personal tasks, built with **Node.js, Express.js and MySQL**, secured with **JWT authentication**.

## Features
- User registration and login with **bcrypt**-hashed passwords
- **JWT**-protected routes; each user can only access their own tasks
- Full CRUD for tasks, with filtering by status and pagination
- **Parameterised SQL queries** throughout (protection against SQL injection)
- Layered structure: routes → controllers → database, with centralised error handling

## Tech Stack
Node.js · Express.js · MySQL (`mysql2`) · JSON Web Tokens · bcryptjs · dotenv

## Project Structure
```
src/
  config/db.js              MySQL connection pool
  controllers/              request handling and business logic
  middleware/               JWT auth, error handling
  routes/                   route definitions
  app.js / server.js        app setup and entry point
schema.sql                  database schema
```

## Getting Started
1. Install Node.js (v18+) and MySQL.
2. Clone the repo and install dependencies:
   ```bash
   git clone https://github.com/15sudhanshu/task-manager-api.git
   cd task-manager-api
   npm install
   ```
3. Create the database: `mysql -u root -p < schema.sql`
4. Copy `.env.example` to `.env` and fill in your MySQL password and a long random `JWT_SECRET`.
5. Start the server: `npm start` (or `npm run dev` for auto-reload).

## API Endpoints
| Method | Endpoint             | Auth | Description                          |
|--------|----------------------|------|--------------------------------------|
| POST   | `/api/auth/register` | No   | Create an account                    |
| POST   | `/api/auth/login`    | No   | Log in, returns a JWT                |
| GET    | `/api/tasks`         | Yes  | List tasks (`?status=done&page=1&limit=10`) |
| POST   | `/api/tasks`         | Yes  | Create a task                        |
| GET    | `/api/tasks/:id`     | Yes  | Get one task                         |
| PUT    | `/api/tasks/:id`     | Yes  | Update a task                        |
| DELETE | `/api/tasks/:id`     | Yes  | Delete a task                        |

Send the token as `Authorization: Bearer <token>`.

## Example Usage
```bash
# Register
curl -X POST http://localhost:3000/api/auth/register -H "Content-Type: application/json" \
  -d '{"name":"Sudhanshu","email":"me@example.com","password":"strongpass123"}'

# Login (copy the token from the response)
curl -X POST http://localhost:3000/api/auth/login -H "Content-Type: application/json" \
  -d '{"email":"me@example.com","password":"strongpass123"}'

# Create a task
curl -X POST http://localhost:3000/api/tasks -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" -d '{"title":"Finish DSA revision","status":"in_progress"}'
```

## Possible Improvements
- Input validation library (e.g. Joi/Zod) and rate limiting
- Automated tests (Jest + Supertest)
- Docker setup and deployment
