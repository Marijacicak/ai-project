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

- `GET /` - Root endpoint
- `GET /hello` - Hello world endpoint
- `GET /docs` - Interactive API documentation

## Environment Variables

Backend environment variables:
- `DATABASE_URL` - PostgreSQL connection string

Copy `.env.example` to `.env` in the backend directory if needed.

## Stopping the Application

```bash
docker-compose down
```

To remove the database volume (all data will be lost):
```bash
docker-compose down -v
```
