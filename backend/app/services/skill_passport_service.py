"""Quantum Skill Passport Service: Issues cryptographically verifiable skill evidence tokens with transfer testing."""

import hashlib
import json
import time
from typing import Dict, Any, List, Optional
from pydantic import BaseModel


class SkillToken(BaseModel):
    token_id: str
    user_id: int
    concept_id: str
    concept_name: str
    mastery_score: float
    transfer_tested: bool
    competency_standard: str
    issued_at: float
    signature_hash: str


class SkillPassportService:
    """Manages verifiable mastery credentials aligned with IEEE and QED-C workforce frameworks."""

    SECRET_SALT = "QUBOT_PASSPORT_SECRET_SALT_2026"

    COMPETENCY_MAPPING = {
        "01": "IEEE-Q-101: Linear Algebra Foundations for Quantum Information",
        "02": "IEEE-Q-102: Qubit Statevector & Hilbert Space Formulations",
        "03": "IEEE-Q-103: Single-Qubit Unitary Rotations & Bloch Sphere Dynamics",
        "04": "IEEE-Q-104: Multi-Qubit Registers & Entangled Bell State Generation",
        "05": "IEEE-Q-201: Quantum Protocols & Teleportation Verification",
        "06": "QED-C-301: Grover Amplitude Amplification & Oracle Construction",
        "07": "QED-C-302: Quantum Fourier Transform & Phase Estimation",
        "08": "QED-C-401: Quantum Cryptography & QKD BB84 Implementation",
        "09": "QED-C-402: Quantum Error Correction & Surface Codes",
    }

    @classmethod
    def generate_token(
        cls,
        user_id: int,
        concept_id: str,
        concept_name: str,
        mastery_score: float,
        transfer_tested: bool = True
    ) -> SkillToken:
        """Generates a verifiable SHA-256 skill token."""
        issued_at = time.time()
        category_code = concept_id.split("-")[0].strip() if "-" in concept_id else concept_id[:2]
        standard = cls.COMPETENCY_MAPPING.get(category_code, "QED-C-GEN: Quantum Information Practitioner")

        raw_payload = f"{user_id}:{concept_id}:{mastery_score:.4f}:{transfer_tested}:{issued_at}:{cls.SECRET_SALT}"
        sig_hash = hashlib.sha256(raw_payload.encode("utf-8")).hexdigest()
        token_id = f"QSP-{user_id:04d}-{sig_hash[:12].upper()}"

        return SkillToken(
            token_id=token_id,
            user_id=user_id,
            concept_id=concept_id,
            concept_name=concept_name,
            mastery_score=round(mastery_score, 4),
            transfer_tested=transfer_tested,
            competency_standard=standard,
            issued_at=issued_at,
            signature_hash=sig_hash,
        )

    @classmethod
    def verify_token(cls, token: SkillToken) -> bool:
        """Verifies integrity of a skill evidence token."""
        raw_payload = f"{token.user_id}:{token.concept_id}:{token.mastery_score:.4f}:{token.transfer_tested}:{token.issued_at}:{cls.SECRET_SALT}"
        expected_hash = hashlib.sha256(raw_payload.encode("utf-8")).hexdigest()
        return token.signature_hash == expected_hash
