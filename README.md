# Description

This project is a small authentication and user-management app. Main flow: register → log in → view dashboard → manage users.

- **Accounts**: Register with username, email, and password. First account becomes admin; later accounts get the user role.
- **Login**: Backend checks hashed passwords and issues a JWT valid for 30 minutes. Browser stores login data locally.
- **Dashboard**: Shows your profile, roles, a backend greeting, and a user table.
- **Admin actions**: Admins can delete other accounts. Regular users get a button to test that deletion is blocked.

# Full-Stack Project with Vite, FastAPI, and PostgreSQL

This project contains a complete full-stack application with:

- **Frontend**: Vite + React
- **Backend**: FastAPI (Python)
- **Database**: PostgreSQL
- **Containerization**: Docker & Docker Compose

## Project Structure

```
.
├── frontend/          # Vite React application
├── backend/           # FastAPI application
├── docker-compose.yml # Docker orchestration
└── README.md         # This file
```

## Quick Start

### Prerequisites

- Docker and Docker Compose installed on your system

### Running the Application

1. Clone the repository and navigate to the project directory
2. Run the following command:

```bash
docker-compose up --build
```

This will:

- Start PostgreSQL database
- Build and start the FastAPI backend
- Build and start the Vite frontend

### Access Points

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs
- **Database**: localhost:5432

## Development

### Frontend Development

The frontend is a Vite + React application with:

- Hot reload enabled
- Proxy configuration to backend API
- Axios for API calls

### Backend Development

The backend is a FastAPI application with:

- SQLAlchemy for database ORM
- PostgreSQL connection
- CORS middleware
- Auto-reload enabled

### Database

- PostgreSQL 15 running in Docker
- Database name: `mydatabase`
- User: `postgres`
- Password: `password`

## API Endpoints

- `GET /` - Root endpoints
- `GET /hello` - Hello world endpoint
- `GET /docs` - Interactive API documentation

## Environment Variables

Backend environment variables:

- `DATABASE_URL` - PostgreSQL connection string

Copy `.env.example` to `.env` in the backend directory if needed.

## Profile chatbot

The bottom-right assistant is available after signing in. It answers questions
about **your own** username, email, roles, active status, creation date, user ID,
and the `GET /auth/me` endpoint. Other users and write operations are outside its
scope, including for administrators.

### Configuration

1. Copy the repository-root `.env.example` to `.env` and set `OPENAI_API_KEY`.
   Use an OpenAI API key, not your ChatGPT login. Never put the key in a `VITE_`
   variable or commit it. `CHAT_MODEL` defaults to `openai:gpt-4.1-mini`.
2. Install frontend dependencies from `frontend` with `npm install`. This also
   updates the lockfile if MUI was previously installed only in a container.
3. Rebuild with `docker compose up -d --build --force-recreate backend frontend`.
4. The frontend uses an anonymous `/app/node_modules` volume. If it still contains
   old dependencies, run `docker compose exec frontend npm install` and then
   `docker compose restart frontend`.
5. Sign out and sign back in using a real backend account. Compose disables MSW
   mock authentication because its fake tokens cannot authenticate MCP requests.

For a backend started outside Docker, install `backend/requirements.txt`, configure
`backend/.env`, and run it on port 8000. The private MCP tool calls the backend on
`127.0.0.1:8000` from inside the same container/process environment.

### How it works

`POST /chat` authenticates the existing JWT. PydanticAI asks the model to select
only supported profile fields; it cannot produce free-form answer text. The
backend then starts a private stdio MCP server with that request's token and calls
its single `get_my_profile` tool. That tool calls `GET /auth/me`, validates its
response, and returns only the public profile schema. Backend templates render
the requested values and source attribution. This enforces the answer's data
scope independently of model instructions.

The token is never a model argument, tool argument, or command-line argument.
There is no public MCP HTTP port and no access to `/auth/users`, arbitrary URLs,
SQL, passwords, or write tools. Model input consists of the current question and
up to six earlier questions; profile values are added locally after model output.
Questions themselves may contain personal information if the user includes it.

Replies arrive as complete, validated messages, with loading, retry, and cancel
controls. History is held in browser memory and clears on refresh or logout;
database conversation storage and token-by-token streaming are not included in
this deliberately restricted profile assistant. Stop cancels the browser request;
an already-started backend/model request may run until its 45-second timeout.

Try “Show my profile”, “What are my roles?”, and “What is my profile endpoint?”.
Missing API credentials produce a setup message; provider/MCP failures return a
generic error without exposing credentials or profile data in exception logs.

## Stopping the Application

```bash
docker-compose down
```

To remove the database volume (all data will be lost):

```bash
docker-compose down -v
```
