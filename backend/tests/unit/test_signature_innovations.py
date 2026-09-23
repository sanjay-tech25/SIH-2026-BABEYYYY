"""Unit tests for the 5 Signature Innovations & Error Hierarchy:
1. Quantum Misconception Engine
2. Predict -> Simulate -> Explain Engine
3. Quantum Digital Twin Engine
4. Quantum Translation Engine (Qiskit, PennyLane, Google Cirq, OpenQASM)
5. Quantum Skill Passport Service
6. 4-Level Error Hierarchy Engine (L1 to L4)
"""

import pytest
from app.engines.misconception_engine import QuantumMisconceptionEngine
from app.engines.prediction_engine import PredictionEngine
from app.engines.digital_twin_engine import QuantumDigitalTwinEngine
from app.quantum.translation_engine import QuantumTranslationEngine
from app.services.skill_passport_service import SkillPassportService
from app.engines.error_hierarchy_engine import QuantumErrorHierarchyEngine, ErrorLevel


def test_misconception_engine_mc01_double_hadamard():
    """Verifies detection of MC-01 (Classical Probability Fallacy) on H + H predicting 50/50."""
    engine = QuantumMisconceptionEngine()
    gates = [{"gate": "H", "qubit": 0}, {"gate": "H", "qubit": 0}]
    predicted = {"0": 0.50, "1": 0.50}
    actual = {"0": 1.0, "1": 0.0}

    diagnostics = engine.evaluate(circuit_gates=gates, predicted_distribution=predicted, actual_distribution=actual)
    codes = [d.code for d in diagnostics]

    assert "MC-01" in codes
    assert "MC-04" in codes
    mc01 = next(d for d in diagnostics if d.code == "MC-01")
    assert "Interference" in mc01.remediation_vault_note


def test_misconception_engine_mc08_endianness():
    """Verifies detection of MC-08 (Register Endianness Confusion)."""
    engine = QuantumMisconceptionEngine()
    gates = [{"gate": "X", "qubit": 0}]  # q0=1, q1=0 -> Qiskit state |01>
    predicted = {"10": 1.0}
    actual = {"01": 1.0}

    diagnostics = engine.evaluate(circuit_gates=gates, predicted_distribution=predicted, actual_distribution=actual)
    codes = [d.code for d in diagnostics]

    assert "MC-08" in codes


def test_prediction_engine_exact_match():
    """Verifies Predict -> Simulate -> Explain on exact match."""
    engine = PredictionEngine()
    predicted = {"0": 0.50, "1": 0.50}
    actual = {"0": 0.49, "1": 0.51}

    result = engine.evaluate_prediction(predicted, actual)
    assert result.is_accurate is True
    assert result.accuracy_tier == "EXACT_MATCH"
    assert result.xp_bonus == 25
    assert result.requires_socratic_explanation is False


def test_prediction_engine_significant_divergence():
    """Verifies Socratic trigger when prediction diverges significantly."""
    engine = PredictionEngine()
    predicted = {"0": 1.0, "1": 0.0}
    actual = {"0": 0.0, "1": 1.0}

    result = engine.evaluate_prediction(predicted, actual)
    assert result.is_accurate is False
    assert result.accuracy_tier == "SIGNIFICANT_DIVERGENCE"
    assert result.requires_socratic_explanation is True
    assert result.divergence_score >= 0.90


def test_digital_twin_calibration():
    """Verifies Quantum Digital Twin Cognitive Calibration Index (CCI)."""
    engine = QuantumDigitalTwinEngine()
    
    # Fully aligned
    mental_aligned = {"0": 0.5, "1": 0.5}
    actual_aligned = {"0": 0.5, "1": 0.5}
    res_aligned = engine.evaluate_twin(mental_aligned, actual_aligned)
    assert res_aligned.alignment_tier == "ALIGNED"
    assert res_aligned.cognitive_calibration_index >= 0.99

    # Divergent
    mental_div = {"0": 1.0, "1": 0.0}
    actual_div = {"0": 0.0, "1": 1.0}
    res_div = engine.evaluate_twin(mental_div, actual_div)
    assert res_div.alignment_tier == "DIVERGENT"
    assert res_div.cognitive_calibration_index == 0.0


def test_quantum_translation_engine_including_cirq():
    """Verifies transpilation across OpenQASM, Qiskit, PennyLane, and Google Cirq."""
    engine = QuantumTranslationEngine()
    gates = [
        {"gate": "H", "qubit": 0},
        {"gate": "CX", "control": 0, "target": 1}
    ]
    res = engine.transpile(num_qubits=2, gates=gates)

    assert "OPENQASM 2.0;" in res.openqasm
    assert "h q[0];" in res.openqasm
    assert "cx q[0], q[1];" in res.openqasm
    assert "qc.h(0)" in res.qiskit_python
    assert "qc.cx(0, 1)" in res.qiskit_python
    assert "qml.Hadamard(wires=0)" in res.pennylane_python
    assert "qml.CNOT(wires=[0, 1])" in res.pennylane_python
    assert "import cirq" in res.cirq_python
    assert "cirq.H(q[0])" in res.cirq_python
    assert "cirq.CNOT(q[0], q[1])" in res.cirq_python
    assert res.qubits == 2
    assert res.gate_count == 2


def test_skill_passport_issuance_and_verification():
    """Verifies generation and cryptographic signature verification of Skill Token."""
    token = SkillPassportService.generate_token(
        user_id=42,
        concept_id="03-Superposition",
        concept_name="Quantum Superposition",
        mastery_score=0.88,
        transfer_tested=True
    )

    assert token.token_id.startswith("QSP-0042-")
    assert token.mastery_score == 0.88
    assert token.transfer_tested is True
    assert "Bloch Sphere" in token.competency_standard

    # Verify signature
    is_valid = SkillPassportService.verify_token(token)
    assert is_valid is True

    # Tamper test
    token.mastery_score = 0.99
    is_tampered_valid = SkillPassportService.verify_token(token)
    assert is_tampered_valid is False


def test_error_hierarchy_engine_l1_to_l4():
    """Verifies 4-level error detection (L1 Code, L2 Circuit, L3 Conceptual, L4 Algorithmic)."""
    # L1 Code Error: malformed gate dict
    errs_l1 = QuantumErrorHierarchyEngine.analyze({
        "num_qubits": 1,
        "gates": ["malformed_string_gate"]
    })
    assert any(e.level == ErrorLevel.L1_CODE_ERROR for e in errs_l1)

    # L2 Circuit Error: out-of-bounds wire and gate after measurement
    errs_l2 = QuantumErrorHierarchyEngine.analyze({
        "num_qubits": 2,
        "gates": [
            {"gate": "M", "qubit": 0},
            {"gate": "H", "qubit": 0},  # post-measurement
            {"gate": "X", "qubit": 5}   # out of bounds wire
        ]
    })
    levels_l2 = [e.level for e in errs_l2]
    assert ErrorLevel.L2_CIRCUIT_ERROR in levels_l2

    # L3 Conceptual Error: high prediction divergence
    errs_l3 = QuantumErrorHierarchyEngine.analyze(
        circuit_data={"num_qubits": 1, "gates": [{"gate": "H", "qubit": 0}]},
        prediction_divergence=0.85
    )
    assert any(e.level == ErrorLevel.L3_CONCEPTUAL_ERROR for e in errs_l3)

    # L4 Algorithmic Error: Bell state missing entanglement
    errs_l4 = QuantumErrorHierarchyEngine.analyze(
        circuit_data={"num_qubits": 2, "gates": [{"gate": "H", "qubit": 0}]},  # missing CNOT
        intended_goal="Bell State Entanglement"
    )
    assert any(e.level == ErrorLevel.L4_ALGORITHMIC_ERROR for e in errs_l4)
