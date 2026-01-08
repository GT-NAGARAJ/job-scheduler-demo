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

// Health
app.get('/', (req, res) => res.json({ ok: true }));

// Create job
app.post('/jobs', async (req, res) => {
  try {
    const { taskName, payload, priority } = req.body;
    const job = await Job.create({
      taskName,
      payload: payload || {},
      priority: priority || 'Low',
      status: 'pending'
    });
    res.status(201).json(job);
  } catch (err) {
    console.error(err);
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

    // Update to running
    job.status = 'running';
    await job.save();

    // Respond quickly and continue processing
    res.json({ ok: true, id: job.id });

    // Simulate processing for 3 seconds
    setTimeout(async () => {
      try {
        job.status = 'completed';
        await job.save();

        const payload = {
          jobId: job.id,
          taskName: job.taskName,
          priority: job.priority,
          payload: job.payload,
          completedAt: new Date().toISOString()
        };

        console.log('Triggering webhook to', WEBHOOK_URL, 'payload:', payload);
        const resp = await axios.post(WEBHOOK_URL, payload).catch(e => e.response || e);
        console.log('Webhook response status:', resp && resp.status ? resp.status : 'no-response');
      } catch (e) {
        console.error('Error finishing job:', e);
      }
    }, 3000);
  } catch (err) {
    console.error(err);
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
