from fastapi import APIRouter, HTTPException

from app.models.schemas import FullAnalysisResponse, SmilesRequest, ToxicityRequest
from app.services.chemistry_service import ChemistryService
from app.services.docking_service import DockingService
from app.services.model_service import ToxicityModelService

router = APIRouter(prefix="/analyze", tags=["analysis"])

chemistry_service = ChemistryService()
docking_service = DockingService()


@router.post("/chemistry")
def analyze_chemistry(payload: SmilesRequest):
    try:
        return chemistry_service.analyze_smiles(payload.smiles)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail={"error": str(exc), "smiles": payload.smiles}) from exc
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=500, detail={"error": f"Chemistry analysis failed: {exc}"}) from exc


@router.post("/toxicity")
def analyze_toxicity(payload: ToxicityRequest):
    try:
        service = ToxicityModelService()
        return service.predict(payload.model_dump())
    except FileNotFoundError as exc:
        raise HTTPException(status_code=503, detail={"error": str(exc)}) from exc
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=500, detail={"error": f"Toxicity prediction failed: {exc}"}) from exc


@router.post("/full", response_model=FullAnalysisResponse)
def analyze_full(payload: SmilesRequest):
    try:
        descriptors = chemistry_service.analyze_smiles(payload.smiles)
        toxicity = ToxicityModelService().predict(descriptors)
        docking = docking_service.run_docking(payload.smiles)
        return {"chemistry": descriptors, "toxicity": toxicity, "docking": docking}
    except ValueError as exc:
        raise HTTPException(status_code=400, detail={"error": str(exc), "smiles": payload.smiles}) from exc
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=500, detail={"error": f"Full pipeline failed: {exc}"}) from exc
