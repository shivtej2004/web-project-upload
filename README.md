# Dockara AI Pro

Production-ready scaffold for AI-driven drug discovery with FastAPI, RDKit, ML toxicity prediction, and docking orchestration.

## Folder Structure

```text
.
├── backend
│   ├── app
│   │   ├── main.py
│   │   ├── models
│   │   │   └── schemas.py
│   │   ├── routes
│   │   │   └── analyze.py
│   │   ├── services
│   │   │   ├── chemistry_service.py
│   │   │   ├── docking_service.py
│   │   │   └── model_service.py
│   │   └── utils
│   │       └── config.py
│   ├── data
│   ├── models
│   ├── scripts
│   │   └── model_training.py
│   ├── tests
│   │   └── test_api_examples.md
│   ├── .env
│   ├── .env.example
│   ├── Dockerfile
│   └── requirements.txt
├── frontend
│   ├── src
│   │   ├── components
│   │   │   └── ResultCard.jsx
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   └── vite.config.js
└── docker
    ├── docker-compose.yml
    └── README.md
```

## Linux Installation (local, without Docker)

### One-command install (recommended)

```bash
./scripts/install_all.sh
```

### Manual steps

1. Create Python environment and install backend deps:
   ```bash
   python3 -m venv .venv
   source .venv/bin/activate
   pip install -r backend/requirements.txt
   ```
2. Train toxicity model artifacts:
   ```bash
   python backend/scripts/model_training.py
   ```
3. Start backend:
   ```bash
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000 --app-dir backend
   ```
4. Start frontend:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## API Examples

Chemistry:
```bash
curl -X POST http://localhost:8000/analyze/chemistry \
  -H "Content-Type: application/json" \
  -d '{"smiles":"CC(=O)OC1=CC=CC=C1C(=O)O"}'
```

Toxicity:
```bash
curl -X POST http://localhost:8000/analyze/toxicity \
  -H "Content-Type: application/json" \
  -d '{"molecular_weight":180.16,"logp":1.2,"tpsa":63.6,"h_donors":1,"h_acceptors":4,"rotatable_bonds":2}'
```

Full pipeline:
```bash
curl -X POST http://localhost:8000/analyze/full \
  -H "Content-Type: application/json" \
  -d '{"smiles":"CCN(CC)CCOC(=O)C1=CC=CC=C1Cl"}'
```

## Notes

- Docking uses OpenBabel + AutoDock Vina when binaries and receptor are available.
- If docking fails (missing receptor/binary/etc.), the API returns a fallback simulated binding affinity so the pipeline remains operational.
