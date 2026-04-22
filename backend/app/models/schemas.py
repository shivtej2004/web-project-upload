from typing import Any, Dict, Optional

from pydantic import BaseModel, Field


class SmilesRequest(BaseModel):
    smiles: str = Field(..., examples=["CC(=O)OC1=CC=CC=C1C(=O)O"])


class DescriptorResponse(BaseModel):
    smiles: str
    molecular_weight: float
    logp: float
    tpsa: float
    h_donors: int
    h_acceptors: int
    rotatable_bonds: int


class ToxicityRequest(BaseModel):
    molecular_weight: float
    logp: float
    tpsa: float
    h_donors: int
    h_acceptors: int
    rotatable_bonds: int


class ToxicityResponse(BaseModel):
    prediction: str
    probability: float


class DockingResult(BaseModel):
    status: str
    binding_affinity: Optional[float] = None
    details: Dict[str, Any] = Field(default_factory=dict)


class FullAnalysisResponse(BaseModel):
    chemistry: Dict[str, Any]
    toxicity: Dict[str, Any]
    docking: Dict[str, Any]
