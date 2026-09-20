"""
Alternative Plan Route
======================
Alternative rescue plan generation endpoint for ResQShield AI.
Produces feasible, de-risked alternative rescue strategies when baseline plans
fail under stress test simulations.
"""

from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field

try:
    from services.plan_store import plan_store
    from services.alternative_generator import AlternativePlanGenerator
except ImportError:
    from backend.services.plan_store import plan_store
    from backend.services.alternative_generator import AlternativePlanGenerator

router = APIRouter(
    tags=["Alternative Planning"]
)


class AlternativePlanRequest(BaseModel):
    stress_test_id: str = Field(..., description="ID of the failed stress test run", example="ST-001")
    failure_analysis_id: str = Field(..., description="ID of the failure analysis report", example="FA-001")

    class Config:
        json_schema_extra = {
            "example": {
                "stress_test_id": "ST-001",
                "failure_analysis_id": "FA-001"
            }
        }


class AlternativePlanResponse(BaseModel):
    alternative_plan_id: str = Field(..., description="Unique generated alternative plan ID", example="AP-001")
    source_plan_id: str = Field(..., description="ID of the original rescue plan", example="RP-001")
    stress_test_id: str = Field(..., description="Referenced stress test run ID", example="ST-001")
    status: str = Field(..., description="Lifecycle status of the generated alternative plan", example="READY_FOR_REVIEW")
    recommended_route: str = Field(..., description="Alternative recommended transit corridor", example="Route C")
    risk_score: int = Field(..., description="Recalculated operational risk score (0-100)", example=48)
    reliability: int = Field(..., description="Recalculated operational reliability score percentage (0-100)", example=88)
    estimated_time: int = Field(..., description="Estimated travel and mission duration in minutes", example=49)
    route_distance: float = Field(..., description="Alternative route distance in kilometers", example=10.2)
    resource_impact: str = Field(..., description="Assessment of resource consumption compared to original plan", example="Uses additional travel distance but preserves battery reserve.")
    reasoning: str = Field(..., description="Detailed explanation of why this alternative plan was selected", example="The original route was rejected because the simulated blockage caused excessive delay and resource consumption. The alternative route avoids the affected area and maintains sufficient operational resources.")
    human_approval_required: bool = Field(default=True, description="Whether human approval is required before execution", example=True)


@router.post(
    "/api/alternative-plan",
    response_model=AlternativePlanResponse,
    status_code=status.HTTP_200_OK,
    summary="Generate Alternative Rescue Plan",
    description="Generates an alternative viable rescue plan that bypasses failures detected during stress testing."
)
def generate_alternative_plan(request: AlternativePlanRequest):
    stress_test = plan_store.get_stress_test(request.stress_test_id)
    if not stress_test:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Stress test '{request.stress_test_id}' not found. Please run a stress test first via POST /api/stress-test."
        )

    failure_analysis = plan_store.get_failure_analysis(request.failure_analysis_id)
    if not failure_analysis:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Failure analysis '{request.failure_analysis_id}' not found. Please run failure analysis first via POST /api/failure-analysis."
        )

    source_plan_id = stress_test.get("plan_id", "RP-001")
    source_plan = plan_store.get_plan(source_plan_id)
    if not source_plan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Source rescue plan '{source_plan_id}' not found."
        )

    # Generate alternative plan using modular deterministic engine
    alt_data = AlternativePlanGenerator.generate(stress_test, failure_analysis, source_plan)

    alt_plan_id = plan_store.get_next_alternative_plan_id()

    response_data = {
        "alternative_plan_id": alt_plan_id,
        "source_plan_id": source_plan_id,
        "stress_test_id": request.stress_test_id,
        "status": alt_data["status"],
        "recommended_route": alt_data["recommended_route"],
        "risk_score": alt_data["risk_score"],
        "reliability": alt_data["reliability"],
        "estimated_time": alt_data["estimated_time"],
        "route_distance": alt_data["route_distance"],
        "resource_impact": alt_data["resource_impact"],
        "reasoning": alt_data["reasoning"],
        "human_approval_required": alt_data["human_approval_required"]
    }

    # Persist alternative plan in in-memory store
    plan_store.save_alternative_plan(response_data)

    return AlternativePlanResponse(**response_data)
