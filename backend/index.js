const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');
const { sequelize, Job } = require('./models');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 4000;
const WEBHOOK_URL = process.env.WEBHOOK_URL || 'https://webhook.site/your-id-here';

// Health check endpoints
app.get('/', (req, res) => res.json({ ok: true }));
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Create job with validation
app.post('/jobs', async (req, res) => {
  try {
    const { taskName, payload, priority } = req.body;
    
    // Input validation
    if (!taskName || typeof taskName !== 'string' || taskName.trim().length === 0) {
      return res.status(400).json({ error: 'taskName is required and must be a non-empty string' });
    }
    
    if (taskName.length > 255) {
      return res.status(400).json({ error: 'taskName must be less than 255 characters' });
    }
    
    const validPriorities = ['Low', 'Medium', 'High'];
    const jobPriority = priority || 'Medium';
    if (!validPriorities.includes(jobPriority)) {
      return res.status(400).json({ error: 'priority must be Low, Medium, or High' });
    }
    
    const job = await Job.create({
      taskName: taskName.trim(),
      payload: payload || {},
      priority: jobPriority,
      status: 'pending'
    });
    
    res.status(201).json(job);
  } catch (err) {
    console.error('Error creating job:', err);
    res.status(500).json({ error: 'Could not create job' });
  }
});

// List jobs with optional filters
app.get('/jobs', async (req, res) => {
  try {
    const { status, priority } = req.query;
    const where = {};
    if (status) where.status = status;
    if (priority) where.priority = priority;
    const jobs = await Job.findAll({ where, order: [['createdAt', 'DESC']] });
    res.json(jobs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not fetch jobs' });
  }
});

// Get job detail
app.get('/jobs/:id', async (req, res) => {
  try {
    const job = await Job.findByPk(req.params.id);
    if (!job) return res.status(404).json({ error: 'Job not found' });
    res.json(job);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not fetch job' });
  }
});

// Run job (simulate processing)
app.post('/run-job/:id', async (req, res) => {
  try {
    const job = await Job.findByPk(req.params.id);
    if (!job) return res.status(404).json({ error: 'Job not found' });
    if (job.status === 'running') return res.status(400).json({ error: 'Job already running' });
    if (job.status === 'completed') return res.status(400).json({ error: 'Job already completed' });

    // Update to running
    job.status = 'running';
    await job.save();
    console.log(`Starting job ${job.id}: ${job.taskName}`);

    // Respond quickly and continue processing
    res.json({ ok: true, id: job.id, status: 'running' });

    // Simulate processing for 3 seconds
    setTimeout(async () => {
      try {
        // Simulate random success/failure (90% success rate)
        const success = Math.random() > 0.1;
        
        job.status = success ? 'completed' : 'failed';
        job.completedAt = new Date();
        await job.save();
        
        console.log(`Job ${job.id} ${success ? 'completed' : 'failed'}`);

        // Send webhook only on completion
        if (success) {
          const webhookPayload = {
            jobId: job.id,
            taskName: job.taskName,
            priority: job.priority,
            payload: job.payload,
            completedAt: job.completedAt.toISOString()
          };

          console.log('Triggering webhook to', WEBHOOK_URL, 'payload:', webhookPayload);
          
          try {
            const resp = await axios.post(WEBHOOK_URL, webhookPayload, {
              timeout: 5000,
              headers: { 'Content-Type': 'application/json' }
            });
            console.log('Webhook response status:', resp.status);
          } catch (webhookError) {
            console.error('Webhook failed:', webhookError.message);
          }
        }
      } catch (e) {
        console.error('Error finishing job:', e);
        // Mark as failed if processing error occurs
        try {
          job.status = 'failed';
          job.completedAt = new Date();
          await job.save();
        } catch (saveError) {
          console.error('Error saving failed job status:', saveError);
        }
      }
    }, 3000);
  } catch (err) {
    console.error('Error running job:', err);
    res.status(500).json({ error: 'Could not run job' });
  }
});

// Optional local webhook receiver for testing
app.post('/webhook-test', (req, res) => {
  console.log('Received webhook test:', req.body);
  res.json({ ok: true });
});

// Start server after DB sync
sequelize.sync().then(() => {
  console.log('DB synced');
  app.listen(PORT, () => console.log(`Backend listening on ${PORT}`));
}).catch(err => {
  console.error('DB sync error:', err);
});
