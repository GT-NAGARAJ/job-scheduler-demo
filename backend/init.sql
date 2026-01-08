-- Job Scheduler Database Initialization Script
-- This script creates the jobs table with proper indexes

USE jobsdb;

-- Grant permissions to root user from any host
GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' IDENTIFIED BY 'jobscheduler123' WITH GRANT OPTION;
FLUSH PRIVILEGES;

-- Create jobs table if it doesn't exist
CREATE TABLE IF NOT EXISTS jobs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    taskName VARCHAR(255) NOT NULL,
    payload JSON,
    priority ENUM('Low', 'Medium', 'High') DEFAULT 'Medium',
    status ENUM('pending', 'running', 'completed', 'failed') DEFAULT 'pending',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    completedAt TIMESTAMP NULL,
    
    -- Indexes for better query performance
    INDEX idx_status (status),
    INDEX idx_priority (priority),
    INDEX idx_created_at (createdAt),
    INDEX idx_status_priority (status, priority)
);