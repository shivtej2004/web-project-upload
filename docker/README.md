# Deployment

## Local Docker Compose (Recommended)

```bash
cd docker
docker compose up --build
```

This default workflow is ready for final demo/review:
- Backend model artifacts baked during image build stay available (no backend bind-mount masking).
- Frontend UI runs in dev mode with live reload.

Backend API docs: http://localhost:8000/docs
Frontend UI: http://localhost:5173

## Optional: Backend live-edit mounts (development only)

If you want backend code hot-editing, use this temporary override in `docker-compose.yml` under `services.backend`:

```yaml
volumes:
  - ../backend/app:/app/backend/app
  - ../backend/scripts:/app/backend/scripts
```

Only mount these subpaths (not `../backend:/app/backend`) to avoid hiding image-built model artifacts.

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
