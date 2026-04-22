from rdkit import Chem
from rdkit.Chem import Crippen, Descriptors, Lipinski, rdMolDescriptors


class ChemistryService:
    @staticmethod
    def analyze_smiles(smiles: str) -> dict:
        molecule = Chem.MolFromSmiles(smiles)
        if molecule is None:
            raise ValueError("Invalid SMILES string")

        return {
            "smiles": smiles,
            "molecular_weight": round(Descriptors.MolWt(molecule), 4),
            "logp": round(Crippen.MolLogP(molecule), 4),
            "tpsa": round(rdMolDescriptors.CalcTPSA(molecule), 4),
            "h_donors": int(Lipinski.NumHDonors(molecule)),
            "h_acceptors": int(Lipinski.NumHAcceptors(molecule)),
            "rotatable_bonds": int(Lipinski.NumRotatableBonds(molecule)),
        }
