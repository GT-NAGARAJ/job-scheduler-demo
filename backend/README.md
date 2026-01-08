Backend (Express + Sequelize)

Quick run (without Docker):
1. Ensure a MySQL instance is available.
2. Copy .env.example to .env and update values.
3. npm install
4. npm run dev

APIs:
- POST /jobs            -> create job (body: taskName, payload (JSON), priority)
- GET  /jobs            -> list jobs (optional query: ?status=completed&priority=High)
- GET  /jobs/:id        -> job detail
- POST /run-job/:id     -> simulate run (updates status and triggers webhook)
- POST /webhook-test    -> test endpoint to receive webhooks locally
