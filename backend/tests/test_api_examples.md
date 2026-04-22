# API Examples

## Run Training

```bash
python backend/scripts/model_training.py
```

## Run API

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000 --app-dir backend
```

## Test Chemistry Endpoint

```bash
curl -X POST http://localhost:8000/analyze/chemistry \
  -H "Content-Type: application/json" \
  -d '{"smiles":"CC(=O)OC1=CC=CC=C1C(=O)O"}'
```

## Test Full Pipeline

```bash
curl -X POST http://localhost:8000/analyze/full \
  -H "Content-Type: application/json" \
  -d '{"smiles":"CCN(CC)CCOC(=O)C1=CC=CC=C1Cl"}'
```
