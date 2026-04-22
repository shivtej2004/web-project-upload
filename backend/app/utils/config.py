from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "Dockara AI Pro"
    app_env: str = "development"
    api_host: str = "0.0.0.0"
    api_port: int = 8000

    model_path: str = "backend/app/models/toxicity_model.pkl"
    scaler_path: str = "backend/app/models/toxicity_scaler.pkl"

    docking_timeout: int = 120
    docking_output_dir: str = "/tmp/docking_runs"
    vina_binary: str = "vina"
    obabel_binary: str = "obabel"
    receptor_pdbqt: str = "backend/data/receptor.pdbqt"

    vina_center_x: float = 0.0
    vina_center_y: float = 0.0
    vina_center_z: float = 0.0

    vina_size_x: float = 20.0
    vina_size_y: float = 20.0
    vina_size_z: float = 20.0

    model_config = SettingsConfigDict(env_file="backend/.env", env_file_encoding="utf-8", case_sensitive=False)


@lru_cache
def get_settings() -> Settings:
    return Settings()
