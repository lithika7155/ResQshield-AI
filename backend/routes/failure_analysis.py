"""
Failure Analysis Route
======================
Deterministic failure investigation and diagnostic endpoint for ResQShield AI.
Evaluates completed stress test results to identify root causes, cascading failure chains,
compromised rescue resources, and mission operational impacts.
"""

from typing import List
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field

try:
    from services.plan_store import plan_store
    from services.failure_analyzer import FailureAnalyzer
except ImportError:
    from backend.services.plan_store import plan_store
    from backend.services.failure_analyzer import FailureAnalyzer

router = APIRouter(
    tags=["Failure Analysis"]
)


class FailureAnalysisRequest(BaseModel):
    stress_test_id: str = Field(..., description="ID of the completed stress test to analyze", example="ST-001")

    class Config:
        json_schema_extra = {
            "example": {
                "stress_test_id": "ST-001"
            }
        }


class FailureAnalysisResponse(BaseModel):
    analysis_id: str = Field(..., description="Unique generated failure analysis ID", example="FA-001")
    stress_test_id: str = Field(..., description="Referenced stress test run ID", example="ST-001")
    status: str = Field(..., description="Failure severity classification (CRITICAL, HIGH, MODERATE)", example="CRITICAL")
    root_cause: str = Field(..., description="Primary root cause identifying why the operation failed", example="Route blockage caused a major detour.")
    failure_chain: List[str] = Field(
        ...,
        description="Sequential causal cascade of the failure event",
        example=[
            "Route Blocked",
            "Detour Required",
            "Travel Time Increased",
            "Battery Consumption Increased",
            "Medical Arrival Delayed",
            "Mission Risk Increased"
        ]
    )
    affected_resources: List[str] = Field(
        ...,
        description="Key rescue assets and operational resources compromised",
        example=[
            "Vehicle Battery",
            "Fuel",
            "Medical Resources",
            "Rescue Team Time"
        ]
    )
    operational_impact: str = Field(..., description="Direct operational consequences on the rescue mission", example="Rescue arrival is significantly delayed and available energy reserves are reduced.")
    recommendation: str = Field(..., description="Actionable recommendation for mitigation", example="Generate and evaluate an alternative rescue plan.")


@router.post(
    "/api/failure-analysis",
    response_model=FailureAnalysisResponse,
    status_code=status.HTTP_200_OK,
    summary="Analyze Stress Test Failure",
    description="Analyzes completed stress test results to diagnose root cause, failure cascade, affected resources, and operational impact."
)
def run_failure_analysis(request: FailureAnalysisRequest):
    stress_test = plan_store.get_stress_test(request.stress_test_id)
    if not stress_test:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Stress test '{request.stress_test_id}' not found. Please run a stress test first via POST /api/stress-test."
        )

    # Optionally retrieve plan data for extra context if present
    plan = plan_store.get_plan(stress_test.get("plan_id", ""))

    # Execute deterministic rule-based analysis
    analysis_result = FailureAnalyzer.analyze(stress_test, plan)

    analysis_id = plan_store.get_next_analysis_id()

    response_data = {
        "analysis_id": analysis_id,
        "stress_test_id": request.stress_test_id,
        "status": analysis_result["status"],
        "root_cause": analysis_result["root_cause"],
        "failure_chain": analysis_result["failure_chain"],
        "affected_resources": analysis_result["affected_resources"],
        "operational_impact": analysis_result["operational_impact"],
        "recommendation": analysis_result["recommendation"]
    }

    # Save analysis in plan store
    plan_store.save_failure_analysis(response_data)

    return FailureAnalysisResponse(**response_data)
