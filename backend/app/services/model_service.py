from pathlib import Path

import joblib
import numpy as np

from app.utils.config import get_settings

FEATURE_ORDER = [
    "molecular_weight",
    "logp",
    "tpsa",
    "h_donors",
    "h_acceptors",
    "rotatable_bonds",
]


class ToxicityModelService:
    def __init__(self) -> None:
        settings = get_settings()
        self.model_path = Path(settings.model_path)
        self.scaler_path = Path(settings.scaler_path)
        self.model = None
        self.scaler = None
        self._load_assets()

    def _load_assets(self) -> None:
        if not self.model_path.exists() or not self.scaler_path.exists():
            raise FileNotFoundError(
                f"Model artifacts missing. Expected: {self.model_path} and {self.scaler_path}. "
                "Run backend/scripts/model_training.py first."
            )
        self.model = joblib.load(self.model_path)
        self.scaler = joblib.load(self.scaler_path)

    def predict(self, descriptors: dict) -> dict:
        values = [descriptors[k] for k in FEATURE_ORDER]
        features = np.array([values], dtype=float)
        scaled = self.scaler.transform(features)
        pred_class = int(self.model.predict(scaled)[0])
        proba = float(self.model.predict_proba(scaled)[0][1])
        return {
            "prediction": "toxic" if pred_class == 1 else "non-toxic",
            "probability": round(proba, 4),
        }
