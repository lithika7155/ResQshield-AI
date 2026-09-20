"""
Rescue Plan Route
=================
Deterministic baseline rescue plan generator for ResQShield AI.
Calculates initial operational metrics (risk, reliability, time, distance, and route)
using deterministic heuristics before downstream simulation and stress testing.
"""

import threading
from typing import List
from fastapi import APIRouter, status
from pydantic import BaseModel, Field

router = APIRouter(
    tags=["Rescue Planning"]
)

# Thread-safe auto-incrementing plan ID counter
_plan_counter = 0
_counter_lock = threading.Lock()


def get_next_plan_id() -> str:
    global _plan_counter
    with _counter_lock:
        _plan_counter += 1
        return f"RP-{_plan_counter:03d}"


class GeneratePlanRequest(BaseModel):
    disaster_type: str = Field(..., description="Type of natural or urban disaster", example="Flood")
    severity: str = Field(..., description="Severity classification (Critical, High, Moderate, Low)", example="Critical")
    location: str = Field(..., description="Target disaster city or region", example="Chennai")
    survivors: int = Field(..., ge=0, description="Estimated number of stranded individuals", example=500)
    rescue_teams: int = Field(..., ge=0, description="Number of deployed rescue personnel teams", example=5)
    vehicles: int = Field(..., ge=0, description="Number of operational rescue vehicles or craft", example=10)
    weather: str = Field(..., description="Current weather conditions", example="Heavy Rain")
    communication: str = Field(..., description="Telemetry and comms link status (Stable, Degraded, Offline)", example="Stable")
    fuel_or_battery: float = Field(..., ge=0, le=100, description="Fleet fuel/battery reserve percentage (0-100)", example=80)
    medical_resources: float = Field(..., ge=0, le=100, description="Medical supply readiness percentage (0-100)", example=70)
    active_hazards: List[str] = Field(default_factory=list, description="Active environmental or infrastructure hazards", example=["Flood Water", "Blocked Road"])
    safe_zone: str = Field(..., description="Designated extraction or evacuation safe zone", example="Shelter A")

    class Config:
        json_schema_extra = {
            "example": {
                "disaster_type": "Flood",
                "severity": "Critical",
                "location": "Chennai",
                "survivors": 500,
                "rescue_teams": 5,
                "vehicles": 10,
                "weather": "Heavy Rain",
                "communication": "Stable",
                "fuel_or_battery": 80,
                "medical_resources": 70,
                "active_hazards": [
                    "Flood Water",
                    "Blocked Road"
                ],
                "safe_zone": "Shelter A"
            }
        }


class GeneratePlanResponse(BaseModel):
    plan_id: str = Field(..., description="Unique generated rescue plan identifier", example="RP-001")
    status: str = Field(..., description="Initial plan status ready for stress testing", example="READY_FOR_STRESS_TEST")
    disaster_type: str = Field(..., description="Disaster type for the plan", example="Flood")
    location: str = Field(..., description="Impacted geographical location", example="Chennai")
    risk_score: int = Field(..., description="Calculated deterministic risk score (0-100)", example=68)
    reliability: int = Field(..., description="Calculated operational reliability score percentage (0-100)", example=82)
    estimated_time: int = Field(..., description="Estimated mission execution time in minutes", example=42)
    route_distance: float = Field(..., description="Total calculated route distance in kilometers", example=8.6)
    recommended_route: str = Field(..., description="Recommended evacuation or rescue corridor", example="Route B")


def calculate_deterministic_plan(req: GeneratePlanRequest) -> GeneratePlanResponse:
    """
    Computes deterministic operational metrics based on hazard severity,
    environmental constraints, resource availability, and terrain hazards.
    No random numbers or unverified ML predictions are used.
    """
    # 1. Risk Score Calculation (0 - 100)
    severity_map = {
        "low": 20,
        "moderate": 35,
        "medium": 35,
        "high": 50,
        "critical": 60,
    }
    base_risk = severity_map.get(req.severity.strip().lower(), 45)

    # Weather impact
    weather_lower = req.weather.strip().lower()
    if any(w in weather_lower for w in ["heavy", "severe", "cyclone", "hurricane", "blizzard", "storm"]):
        weather_risk = 8
    elif any(w in weather_lower for w in ["rain", "wind", "fog", "snow"]):
        weather_risk = 4
    else:
        weather_risk = 0

    # Hazards impact (4 points per hazard, max 20)
    hazard_risk = min(len(req.active_hazards) * 4, 20)

    # Communication penalty
    comm_lower = req.communication.strip().lower()
    if "stable" in comm_lower:
        comm_penalty = 0
    elif "degrad" in comm_lower:
        comm_penalty = 5
    else:
        comm_penalty = 10

    # Resource deficit penalty (based on fuel & medical)
    avg_resource = (req.fuel_or_battery + req.medical_resources) / 2.0
    resource_penalty = round(max(0.0, (100.0 - avg_resource) * 0.08))

    # Team & vehicle mitigation (max 12 points)
    team_mitigation = min(12, int(req.rescue_teams * 1.0 + req.vehicles * 0.5))

    calculated_risk = int(base_risk + weather_risk + hazard_risk + comm_penalty + resource_penalty - team_mitigation)
    risk_score = max(5, min(95, calculated_risk))

    # 2. Reliability Calculation (0 - 100)
    comm_deduction = 2 if "stable" in comm_lower else (10 if "degrad" in comm_lower else 20)
    resource_deficit = round(max(0.0, (100.0 - avg_resource) * 0.24))
    hazard_deduction = min(len(req.active_hazards) * 3, 18)

    sev_deductions = {
        "critical": 6,
        "high": 4,
        "moderate": 2,
        "medium": 2,
        "low": 0
    }
    sev_deduction = sev_deductions.get(req.severity.strip().lower(), 3)
    weather_deduction = 4 if weather_risk >= 8 else (2 if weather_risk > 0 else 0)
    fleet_bonus = min(6, int((req.rescue_teams + req.vehicles) / 2.5))

    calculated_reliability = 100 - comm_deduction - resource_deficit - hazard_deduction - sev_deduction - weather_deduction + fleet_bonus
    reliability = max(10, min(99, int(calculated_reliability)))

    # 3. Estimated Time in minutes
    base_time = 25
    time_sev = 6 if "critical" in req.severity.lower() else (4 if "high" in req.severity.lower() else 2)
    time_weather = 4 if weather_risk >= 8 else (2 if weather_risk > 0 else 0)
    time_hazards = int(len(req.active_hazards) * 2.5)
    time_survivors = min(10, int(req.survivors / 100))
    time_mitigation = min(6, int(req.vehicles * 0.3))

    estimated_time = int(base_time + time_sev + time_weather + time_hazards + time_survivors - time_mitigation)

    # 4. Route Distance in km
    base_dist = 6.0
    hazard_detour = len(req.active_hazards) * 0.8
    weather_detour = 1.0 if weather_risk >= 8 else (0.5 if weather_risk > 0 else 0.0)
    route_distance = round(base_dist + hazard_detour + weather_detour, 1)

    # 5. Recommended Route Selection
    hazard_str = " ".join(req.active_hazards).lower()
    if len(req.active_hazards) >= 4 or "collapsed" in hazard_str:
        recommended_route = "Route C"
    elif len(req.active_hazards) > 0 or "critical" in req.severity.lower() or "heavy" in weather_lower:
        recommended_route = "Route B"
    else:
        recommended_route = "Route A"

    plan_id = get_next_plan_id()

    response = GeneratePlanResponse(
        plan_id=plan_id,
        status="READY_FOR_STRESS_TEST",
        disaster_type=req.disaster_type,
        location=req.location,
        risk_score=risk_score,
        reliability=reliability,
        estimated_time=estimated_time,
        route_distance=route_distance,
        recommended_route=recommended_route
    )

    # Persist in-memory so downstream stress test module can reference it
    try:
        from services.plan_store import plan_store
    except ImportError:
        from backend.services.plan_store import plan_store

    plan_store.save_plan({
        **req.model_dump(),
        **response.model_dump()
    })

    return response


@router.post(
    "/api/generate-plan",
    response_model=GeneratePlanResponse,
    status_code=status.HTTP_200_OK,
    summary="Generate Deterministic Rescue Plan",
    description="Calculates a baseline operational disaster rescue plan with risk, reliability, and route heuristics."
)
def generate_plan(request: GeneratePlanRequest):
    return calculate_deterministic_plan(request)
