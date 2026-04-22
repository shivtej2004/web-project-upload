# Deployment

## Local Docker Compose

```bash
cd docker
docker compose up --build
```

Backend: http://localhost:8000/docs
Frontend: http://localhost:5173

## Render Deployment

1. Create two Render services (Web Service for backend, Static Site or Web Service for frontend).
2. Backend build command:
   ```bash
   pip install -r backend/requirements.txt && python backend/scripts/model_training.py
   ```
3. Backend start command:
   ```bash
   uvicorn app.main:app --app-dir backend --host 0.0.0.0 --port $PORT
   ```
4. Add environment variables from `backend/.env.example`.
5. Frontend build command:
   ```bash
   npm install && npm run build
   ```
6. Publish directory: `frontend/dist`.
7. Set `VITE_API_URL` to backend public URL.
