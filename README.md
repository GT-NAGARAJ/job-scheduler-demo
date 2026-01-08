# Job Scheduler & Automation System

A full-stack job scheduling and automation system built with **Next.js**, **Express.js**, **MySQL**, and **Docker**. This application allows users to create, manage, and monitor automated jobs with webhook notifications.

![Job Scheduler Dashboard](https://img.shields.io/badge/Status-Production%20Ready-green)
![Tech Stack](https://img.shields.io/badge/Stack-Next.js%20%7C%20Express%20%7C%20MySQL-blue)
![Docker](https://img.shields.io/badge/Docker-Ready-blue)

## 🚀 Features

### ✅ **Core Functionality**
- **Job Creation** - User-friendly forms with predefined templates
- **Job Execution** - Async job processing with 3-second simulation
- **Status Tracking** - Real-time job status monitoring (pending → running → completed/failed)
- **Webhook Integration** - Automatic notifications on job completion
- **Dashboard** - Modern UI with filtering and statistics

### ✅ **Job Templates**
- **📧 Email Jobs** - Send emails with templates
- **📊 Report Generation** - Create various report types
- **🔄 Data Sync** - Synchronize data between systems
- **🔔 Notifications** - Send push/SMS/email notifications
- **⚙️ Custom Tasks** - Flexible custom job creation

### ✅ **Technical Features**
- **Modern UI** - Tailwind CSS with responsive design
- **Real-time Updates** - Auto-refresh for running jobs
- **Input Validation** - Comprehensive form validation
- **Error Handling** - Robust error management
- **Health Checks** - System monitoring endpoints
- **Docker Ready** - Complete containerization

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Next.js       │───▶│   Express.js    │───▶│     MySQL       │
│   Frontend      │    │   Backend       │    │   Database      │
│   Port: 3000    │    │   Port: 4000    │    │   Port: 3306    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                               │
                               ▼
                       ┌─────────────────┐
                       │   Webhook       │
                       │   Endpoint      │
                       │ (webhook.site)  │
                       └─────────────────┘
```

## 📁 Project Structure

```
job-scheduler-demo/
├── backend/                 # Express.js API server
│   ├── models/             # Sequelize database models
│   │   ├── index.js        # Database connection
│   │   └── job.js          # Job model definition
│   ├── init.sql            # Database initialization script
│   ├── index.js            # Main server file
│   ├── package.json        # Backend dependencies
│   └── Dockerfile          # Backend container config
├── frontend/               # Next.js React application
│   ├── components/         # Reusable React components
│   │   ├── ui/            # Base UI components
│   │   │   ├── Button.js   # Button component
│   │   │   ├── Card.js     # Card component
│   │   │   ├── Form.js     # Form components
│   │   │   └── Badge.js    # Badge component
│   │   ├── JobForm.js      # Job creation form
│   │   ├── JobTable.js     # Jobs dashboard table
│   │   └── Layout.js       # Page layout wrapper
│   ├── pages/              # Next.js pages
│   │   ├── job/[id].js     # Job detail page
│   │   ├── index.js        # Dashboard page
│   │   └── _app.js         # App wrapper
│   ├── styles/             # CSS styles
│   ├── package.json        # Frontend dependencies
│   └── Dockerfile          # Frontend container config
├── nginx/                  # Reverse proxy config
│   └── nginx.conf          # Nginx configuration
├── docker-compose.yml      # Development setup
├── docker-compose.prod.yml # Production setup
├── .env.example            # Environment variables template
└── README.md              # This file
```

## 🚀 Quick Start

### Prerequisites
- **Docker** & **Docker Compose** (recommended)
- **Node.js 18+** (for local development)
- **MySQL 8.0** (if running locally)

### 1. Clone & Setup
```bash
git clone <your-repo-url>
cd job-scheduler-demo
cp .env.example .env
```

### 2. Configure Webhook
1. Go to [webhook.site](https://webhook.site)
2. Copy your unique webhook URL
3. Update `.env` file:
```env
WEBHOOK_URL=https://webhook.site/your-unique-id-here
```

### 3. Start with Docker (Recommended)
```bash
# Development mode
docker compose up --build

# Production mode
docker compose -f docker-compose.prod.yml up --build
```

### 4. Access Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:4000
- **Database**: localhost:3306

## 🔧 Local Development (Without Docker)

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Configure MySQL database
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## 📊 Database Schema

```sql
CREATE TABLE jobs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    taskName VARCHAR(255) NOT NULL,
    payload JSON,
    priority ENUM('Low', 'Medium', 'High') DEFAULT 'Medium',
    status ENUM('pending', 'running', 'completed', 'failed') DEFAULT 'pending',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    completedAt TIMESTAMP NULL,
    
    -- Performance indexes
    INDEX idx_status (status),
    INDEX idx_priority (priority),
    INDEX idx_created_at (createdAt),
    INDEX idx_status_priority (status, priority)
);
```

## 🔌 API Documentation

### Base URL: `http://localhost:4000`

### **Health Check**
```http
GET /health
```
**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2026-01-08T12:00:00.000Z",
  "uptime": 3600,
  "environment": "development"
}
```

### **Create Job**
```http
POST /jobs
Content-Type: application/json

{
  "taskName": "Send Welcome Email",
  "payload": {
    "recipientEmail": "user@example.com",
    "template": "welcome"
  },
  "priority": "High"
}
```
**Response:**
```json
{
  "id": 1,
  "taskName": "Send Welcome Email",
  "payload": { "recipientEmail": "user@example.com", "template": "welcome" },
  "priority": "High",
  "status": "pending",
  "createdAt": "2026-01-08T12:00:00.000Z",
  "updatedAt": "2026-01-08T12:00:00.000Z"
}
```

### **List Jobs**
```http
GET /jobs?status=pending&priority=High
```
**Query Parameters:**
- `status` (optional): `pending`, `running`, `completed`, `failed`
- `priority` (optional): `Low`, `Medium`, `High`

### **Get Job Details**
```http
GET /jobs/:id
```

### **Run Job**
```http
POST /run-job/:id
```
**Response:**
```json
{
  "ok": true,
  "id": 1,
  "status": "running"
}
```

### **Webhook Test Endpoint**
```http
POST /webhook-test
```

## 🎯 Job Processing Flow

1. **Job Creation** → Status: `pending`
2. **Job Execution** → Status: `running`
3. **Processing** → 3-second simulation
4. **Completion** → Status: `completed` or `failed`
5. **Webhook Trigger** → POST to configured webhook URL

### Webhook Payload
```json
{
  "jobId": 1,
  "taskName": "Send Welcome Email",
  "priority": "High",
  "payload": { "recipientEmail": "user@example.com" },
  "completedAt": "2026-01-08T12:03:00.000Z"
}
```

## 🎨 Frontend Components

### **JobForm Component**
- **Template Selection** - Visual job type picker
- **Dynamic Forms** - Context-aware form fields
- **Validation** - Real-time form validation
- **Error Handling** - User-friendly error messages

### **JobTable Component**
- **Statistics Cards** - Job count by status
- **Filtering** - Status and priority filters
- **Real-time Updates** - Auto-refresh functionality
- **Actions** - View and run job buttons

### **Job Detail Page**
- **Status Timeline** - Visual job progress
- **Auto-refresh** - Updates for running jobs
- **Data Visualization** - Formatted payload display
- **Action Buttons** - Context-aware controls

## 🔒 Environment Variables

```env
# Application
NODE_ENV=development

# Database
DB_ROOT_PASSWORD=jobscheduler123
DB_NAME=jobsdb
DB_USER=root
DB_PASS=jobscheduler123
DB_PORT=3306

# Backend
BACKEND_PORT=4000
JWT_SECRET=your-jwt-secret-key

# Frontend
FRONTEND_PORT=3000
NEXT_PUBLIC_API_URL=http://localhost:4000

# Webhook
WEBHOOK_URL=https://webhook.site/your-unique-id
```

## 🐳 Docker Configuration

### Development
```yaml
# docker-compose.yml
services:
  db: mysql:8.0 with health checks
  backend: Express.js API server
  frontend: Next.js application
```

### Production
```yaml
# docker-compose.prod.yml
services:
  db: MySQL with optimized settings
  backend: Production Express server
  frontend: Optimized Next.js build
  nginx: Reverse proxy
```

## 🧪 Testing the Application

### 1. Create a Job
1. Open http://localhost:3000
2. Select a job template (Email, Report, etc.)
3. Fill in the required fields
4. Click "Create Job"

### 2. Run a Job
1. Find your job in the dashboard
2. Click "Run" button
3. Watch status change: pending → running → completed
4. Check webhook.site for webhook payload

### 3. Monitor Jobs
- View job statistics in dashboard cards
- Filter jobs by status and priority
- Click job names to view detailed information

## 🚀 Production Deployment

### Using Docker Compose
```bash
# Create production environment file
cp .env.example .env.prod

# Update production settings
# Set NODE_ENV=production
# Configure secure database passwords
# Set production webhook URL

# Deploy
docker compose -f docker-compose.prod.yml up -d
```

### Environment Considerations
- **Database Security** - Use strong passwords
- **JWT Secrets** - Generate secure random keys
- **Webhook URLs** - Use production webhook endpoints
- **SSL/TLS** - Configure HTTPS in production
- **Monitoring** - Set up logging and monitoring

## 🔍 Troubleshooting

### Common Issues

**Database Connection Failed**
```bash
# Check database container
docker compose logs db

# Verify credentials in .env file
# Ensure database is healthy before backend starts
```

**Webhook Not Working**
```bash
# Verify webhook URL is accessible
curl -X POST https://webhook.site/your-id -d '{"test": true}'

# Check backend logs
docker compose logs backend
```

**Frontend Build Errors**
```bash
# Clear node modules and rebuild
docker compose down
docker compose up --build --force-recreate
```

**Port Conflicts**
```bash
# Change ports in .env file
FRONTEND_PORT=3001
BACKEND_PORT=4001
DB_PORT=3307
```

## 📈 Performance & Scalability

### Current Limitations
- **Single Instance** - No horizontal scaling
- **In-Memory Processing** - Jobs run in main thread
- **No Queue System** - Sequential job processing

### Production Improvements
- **Job Queue** - Redis/Bull for job queuing
- **Worker Processes** - Separate job workers
- **Load Balancing** - Multiple backend instances
- **Database Optimization** - Connection pooling
- **Caching** - Redis for session/data caching

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js** - React framework
- **Express.js** - Node.js web framework
- **MySQL** - Database system
- **Tailwind CSS** - Utility-first CSS framework
- **Docker** - Containerization platform
- **Lucide React** - Icon library

---

**Built with ❤️ for learning and demonstration purposes**

For questions or support, please open an issue in the repository.