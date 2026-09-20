"""
Stress Testing Route
====================
Deterministic disaster stress test simulation endpoint for ResQShield AI.
Evaluates rescue plan resiliency under single or multi-vector disruptions
and generates causal failure propagation chains without ML or random values.
"""

from typing import List, Optional
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field

try:
    from services.plan_store import plan_store
    from services.stress_simulator import StressSimulator
except ImportError:
    from backend.services.plan_store import plan_store
    from backend.services.stress_simulator import StressSimulator

router = APIRouter(
    tags=["Stress Testing"]
)


class StressTestRequest(BaseModel):
    plan_id: str = Field(..., description="ID of the rescue plan to stress test", example="RP-001")
    selected_scenarios: List[str] = Field(
        ...,
        min_length=1,
        description="One or more stress test scenario keys to simulate",
        example=[
            "route_blocked",
            "low_battery",
            "signal_loss",
            "new_hazard",
            "survivor_location_error"
        ]
    )

    class Config:
        json_schema_extra = {
            "example": {
                "plan_id": "RP-001",
                "selected_scenarios": [
                    "route_blocked",
                    "low_battery",
                    "signal_loss",
                    "new_hazard",
                    "survivor_location_error"
                ]
            }
        }


class StressTestResponse(BaseModel):
    stress_test_id: str = Field(..., description="Unique generated stress test run ID", example="ST-001")
    plan_id: str = Field(..., description="ID of the tested rescue plan", example="RP-001")
    status: str = Field(..., description="Plan stress evaluation outcome (FAILED / PASSED)", example="FAILED")
    original_risk: int = Field(..., description="Original baseline plan risk score (0-100)", example=68)
    simulated_risk: int = Field(..., description="Recalculated risk score under stress conditions (0-100)", example=91)
    original_reliability: int = Field(..., description="Original operational reliability percentage (0-100)", example=82)
    simulated_reliability: int = Field(..., description="Recalculated operational reliability percentage (0-100)", example=54)
    original_time: int = Field(..., description="Original estimated mission duration in minutes", example=42)
    simulated_time: int = Field(..., description="Recalculated estimated mission duration under stress in minutes", example=67)
    failure_detected: bool = Field(..., description="Whether critical failure threshold was triggered", example=True)
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
    resource_impact: Optional[str] = Field(
        default=None,
        description="Detailed resource depletion and operational impact assessment",
        example="Fleet forced into 4.2km rough terrain detour; battery and fuel reserve depleted by 28%."
    )


@router.post(
    "/api/stress-test",
    response_model=StressTestResponse,
    status_code=status.HTTP_200_OK,
    summary="Simulate Stress Test Scenarios",
    description="Simulates environmental, infrastructural, and operational failures on a rescue plan."
)
def run_stress_test(request: StressTestRequest):
    plan = plan_store.get_plan(request.plan_id)
    if not plan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Rescue plan '{request.plan_id}' not found. Please generate a plan first via POST /api/generate-plan."
        )

    # Execute deterministic simulation via modular engine
    sim_result = StressSimulator.simulate(plan, request.selected_scenarios)

    stress_test_id = plan_store.get_next_test_id()

    response_data = {
        "stress_test_id": stress_test_id,
        "plan_id": request.plan_id,
        "status": sim_result["status"],
        "original_risk": sim_result["original_risk"],
        "simulated_risk": sim_result["simulated_risk"],
        "original_reliability": sim_result["original_reliability"],
        "simulated_reliability": sim_result["simulated_reliability"],
        "original_time": sim_result["original_time"],
        "simulated_time": sim_result["simulated_time"],
        "failure_detected": sim_result["failure_detected"],
        "failure_chain": sim_result["failure_chain"],
        "resource_impact": sim_result.get("resource_impact")
    }

    # Save stress test result for potential future downstream retrieval
    plan_store.save_stress_test(response_data)

    return StressTestResponse(**response_data)
