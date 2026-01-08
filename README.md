# Job Scheduler & Automation - Demo

A full-stack job scheduling and automation system built with Node.js, Express, Next.js, and MySQL.

## Contents
- `backend/` : Express + Sequelize API with job management
- `frontend/` : Next.js app with Tailwind CSS dashboard
- `docker-compose.yml` : Development environment setup
- `docker-compose.prod.yml` : Production environment setup
- `nginx/` : Reverse proxy configuration

## Quick Start (Development)

### Prerequisites
- Docker & Docker Compose
- Node.js 18+ (for local development)

### Using Docker (Recommended)

1. **Clone and setup environment:**
   ```bash
   git clone <your-repo-url>
   cd job-scheduler-demo
   cp .env.example .env
   ```

2. **Update webhook URL in `.env`:**
   - Go to https://webhook.site and copy your unique URL
   - Replace `WEBHOOK_URL` in `.env` with your webhook.site URL

3. **Start the application:**
   ```bash
   docker compose up --build
   ```

4. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:4000
   - Database: localhost:3306

### Production Deployment

For production deployment with nginx reverse proxy:

```bash
docker compose -f docker-compose.prod.yml up --build
```

Access via: http://localhost (port 80)

## Environment Variables

Key environment variables (see `.env.example`):

- `WEBHOOK_URL` - Your webhook endpoint for job completion notifications
- `DB_USER`, `DB_PASS` - Database credentials
- `JWT_SECRET` - Secret key for authentication
- `NODE_ENV` - Environment (development/production)

## API Endpoints

- `POST /jobs` - Create a new job
- `GET /jobs` - List all jobs with filtering
- `GET /jobs/:id` - Get job details
- `POST /run-job/:id` - Execute a job
- `GET /health` - Health check endpoint

## Features

✅ **Job Management**
- Create jobs with custom payloads
- Priority levels (Low/Medium/High)
- Status tracking (pending/running/completed/failed)

✅ **Dashboard**
- Modern UI with Tailwind CSS
- Job listing with filters
- Real-time status updates
- Job detail views

✅ **Webhook Integration**
- Automatic webhook notifications on job completion
- Configurable webhook endpoints
- Request/response logging

✅ **Production Ready**
- Docker containerization
- Health checks
- Environment-based configuration
- Nginx reverse proxy
- Database initialization scripts

## Database Schema

```sql
CREATE TABLE jobs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    taskName VARCHAR(255) NOT NULL,
    payload JSON,
    priority ENUM('Low', 'Medium', 'High') DEFAULT 'Medium',
    status ENUM('pending', 'running', 'completed', 'failed') DEFAULT 'pending',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    completedAt TIMESTAMP NULL
);
```

## Local Development

If you prefer to run without Docker:

1. **Setup MySQL database**
2. **Backend:**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   npm run dev
   ```
3. **Frontend:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

See individual README files in `backend/` and `frontend/` directories for detailed setup instructions.

## Architecture

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Next.js   │───▶│   Express   │───▶│    MySQL    │
│  Frontend   │    │   Backend   │    │  Database   │
└─────────────┘    └─────────────┘    └─────────────┘
                           │
                           ▼
                   ┌─────────────┐
                   │   Webhook   │
                   │  Endpoint   │
                   └─────────────┘
```

## Notes

- This is an educational demo showcasing full-stack development practices
- For production use, consider adding authentication, rate limiting, and comprehensive logging
- The job simulation uses a 3-second delay to demonstrate async processing
- Webhook integration allows for external system notifications

## Troubleshooting

**Database Connection Issues:**
- Ensure MySQL container is healthy: `docker compose ps`
- Check database logs: `docker compose logs db`

**Webhook Not Working:**
- Verify webhook URL is accessible
- Check backend logs for webhook request details

**Port Conflicts:**
- Modify ports in `.env` file if default ports are in use
