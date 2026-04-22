from pathlib import Path

import joblib
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler

RNG = np.random.default_rng(42)
N_SAMPLES = 2500
FEATURES = [
    "molecular_weight",
    "logp",
    "tpsa",
    "h_donors",
    "h_acceptors",
    "rotatable_bonds",
]


def generate_synthetic_dataset(n_samples: int = N_SAMPLES) -> pd.DataFrame:
    df = pd.DataFrame(
        {
            "molecular_weight": RNG.uniform(120, 750, n_samples),
            "logp": RNG.uniform(-2.0, 8.0, n_samples),
            "tpsa": RNG.uniform(5, 220, n_samples),
            "h_donors": RNG.integers(0, 8, n_samples),
            "h_acceptors": RNG.integers(0, 14, n_samples),
            "rotatable_bonds": RNG.integers(0, 18, n_samples),
        }
    )
    toxicity_signal = (
        (df["molecular_weight"] > 520).astype(int)
        + (df["logp"] > 4.5).astype(int)
        + (df["tpsa"] < 25).astype(int)
        + (df["h_acceptors"] > 9).astype(int)
        + (df["rotatable_bonds"] > 10).astype(int)
    )
    noise = RNG.integers(0, 2, n_samples)
    df["toxic"] = ((toxicity_signal + noise) >= 3).astype(int)
    return df


def train_and_save() -> None:
    df = generate_synthetic_dataset()
    X = df[FEATURES]
    y = df["toxic"]

    X_train, _, y_train, _ = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)

    model = RandomForestClassifier(n_estimators=350, random_state=42, class_weight="balanced")
    model.fit(X_train_scaled, y_train)

    model_dir = Path("backend/app/models")
    model_dir.mkdir(parents=True, exist_ok=True)

    joblib.dump(model, model_dir / "toxicity_model.pkl")
    joblib.dump(scaler, model_dir / "toxicity_scaler.pkl")
    print("Saved model artifacts to backend/app/models")


if __name__ == "__main__":
    train_and_save()
