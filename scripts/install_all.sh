#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

echo "[1/4] Creating/updating Python virtual environment..."
python3 -m venv .venv

# shellcheck disable=SC1091
source .venv/bin/activate

echo "[2/4] Installing backend dependencies..."
pip install --upgrade pip
pip install -r backend/requirements.txt

echo "[3/4] Training backend toxicity model artifacts..."
python backend/scripts/model_training.py

echo "[4/4] Installing frontend dependencies..."
npm --prefix frontend install

echo
echo "✅ Install complete."
echo "Start backend: source .venv/bin/activate && uvicorn app.main:app --reload --host 0.0.0.0 --port 8000 --app-dir backend"
echo "Start frontend: npm --prefix frontend run dev -- --host 0.0.0.0 --port 5173"
