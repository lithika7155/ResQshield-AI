"""
Plan & Simulation In-Memory Store
=================================
Thread-safe temporary in-memory store for ResQShield AI plans and stress tests.
Ensures generated plans are accessible across decoupled route modules.
"""

import threading
from typing import Dict, Any, Optional, List


class PlanStore:
    def __init__(self):
        self._lock = threading.Lock()
        self._plans: Dict[str, Dict[str, Any]] = {}
        self._stress_tests: Dict[str, Dict[str, Any]] = {}
        self._test_counter = 0
        self._analyses: Dict[str, Dict[str, Any]] = {}
        self._analysis_counter = 0
        self._alternative_plans: Dict[str, Dict[str, Any]] = {}
        self._alt_counter = 0
        self._approvals: Dict[str, Dict[str, Any]] = {}
        self._approval_counter = 0

        # Pre-seed baseline example plan RP-001 so stress-testing can run immediately
        self._plans["RP-001"] = {
            "plan_id": "RP-001",
            "status": "READY_FOR_STRESS_TEST",
            "disaster_type": "Flood",
            "location": "Chennai",
            "severity": "Critical",
            "survivors": 500,
            "rescue_teams": 5,
            "vehicles": 10,
            "weather": "Heavy Rain",
            "communication": "Stable",
            "fuel_or_battery": 80.0,
            "medical_resources": 70.0,
            "active_hazards": ["Flood Water", "Blocked Road"],
            "safe_zone": "Shelter A",
            "risk_score": 68,
            "reliability": 82,
            "estimated_time": 42,
            "route_distance": 8.6,
            "recommended_route": "Route B"
        }

        # Pre-seed baseline stress test ST-001 so failure analysis can run immediately
        self._stress_tests["ST-001"] = {
            "stress_test_id": "ST-001",
            "plan_id": "RP-001",
            "status": "FAILED",
            "original_risk": 68,
            "simulated_risk": 91,
            "original_reliability": 82,
            "simulated_reliability": 54,
            "original_time": 42,
            "simulated_time": 67,
            "failure_detected": True,
            "selected_scenarios": ["route_blocked"],
            "failure_chain": [
                "Route Blocked",
                "Detour Required",
                "Travel Time Increased",
                "Battery Consumption Increased",
                "Medical Arrival Delayed",
                "Mission Risk Increased"
            ],
            "resource_impact": "Fleet forced into 4.2km rough terrain detour; battery and fuel reserve depleted by 28%."
        }

        # Pre-seed baseline failure analysis FA-001 so alternative planning can run immediately
        self._analyses["FA-001"] = {
            "analysis_id": "FA-001",
            "stress_test_id": "ST-001",
            "status": "CRITICAL",
            "root_cause": "Route blockage caused a major detour.",
            "failure_chain": [
                "Route Blocked",
                "Detour Required",
                "Travel Time Increased",
                "Battery Consumption Increased",
                "Medical Arrival Delayed",
                "Mission Risk Increased"
            ],
            "affected_resources": [
                "Vehicle Battery",
                "Fuel",
                "Medical Resources",
                "Rescue Team Time"
            ],
            "operational_impact": "Rescue arrival is significantly delayed and available energy reserves are reduced.",
            "recommendation": "Generate and evaluate an alternative rescue plan."
        }

        # Pre-seed baseline alternative plan AP-001 so human approval can run immediately
        self._alternative_plans["AP-001"] = {
            "alternative_plan_id": "AP-001",
            "source_plan_id": "RP-001",
            "stress_test_id": "ST-001",
            "status": "READY_FOR_REVIEW",
            "recommended_route": "Route C",
            "risk_score": 48,
            "reliability": 88,
            "estimated_time": 49,
            "route_distance": 10.2,
            "resource_impact": "Uses additional travel distance but preserves battery reserve.",
            "reasoning": "The original route was rejected because the simulated blockage caused excessive delay and resource consumption. The alternative route avoids the affected area and maintains sufficient operational resources.",
            "human_approval_required": True
        }

    def save_plan(self, plan_data: Dict[str, Any]) -> None:
        with self._lock:
            self._plans[plan_data["plan_id"]] = plan_data

    def get_plan(self, plan_id: str) -> Optional[Dict[str, Any]]:
        with self._lock:
            return self._plans.get(plan_id)

    def get_all_plans(self) -> List[Dict[str, Any]]:
        with self._lock:
            return list(self._plans.values())

    def get_next_test_id(self) -> str:
        with self._lock:
            self._test_counter += 1
            return f"ST-{self._test_counter:03d}"

    def save_stress_test(self, test_data: Dict[str, Any]) -> None:
        with self._lock:
            self._stress_tests[test_data["stress_test_id"]] = test_data

    def get_stress_test(self, test_id: str) -> Optional[Dict[str, Any]]:
        with self._lock:
            return self._stress_tests.get(test_id)

    def get_next_analysis_id(self) -> str:
        with self._lock:
            self._analysis_counter += 1
            return f"FA-{self._analysis_counter:03d}"

    def save_failure_analysis(self, analysis_data: Dict[str, Any]) -> None:
        with self._lock:
            self._analyses[analysis_data["analysis_id"]] = analysis_data

    def get_failure_analysis(self, analysis_id: str) -> Optional[Dict[str, Any]]:
        with self._lock:
            return self._analyses.get(analysis_id)

    def get_next_alternative_plan_id(self) -> str:
        with self._lock:
            self._alt_counter += 1
            return f"AP-{self._alt_counter:03d}"

    def save_alternative_plan(self, alt_data: Dict[str, Any]) -> None:
        with self._lock:
            self._alternative_plans[alt_data["alternative_plan_id"]] = alt_data

    def get_alternative_plan(self, alt_id: str) -> Optional[Dict[str, Any]]:
        with self._lock:
            return self._alternative_plans.get(alt_id)

    def get_all_alternative_plans(self) -> List[Dict[str, Any]]:
        with self._lock:
            return list(self._alternative_plans.values())

    def update_alternative_plan_status(self, alt_id: str, new_status: str) -> bool:
        with self._lock:
            if alt_id in self._alternative_plans:
                self._alternative_plans[alt_id]["status"] = new_status
                return True
            return False

    def get_next_approval_id(self) -> str:
        with self._lock:
            self._approval_counter += 1
            return f"HA-{self._approval_counter:03d}"

    def save_approval(self, approval_data: Dict[str, Any]) -> None:
        with self._lock:
            self._approvals[approval_data["approval_id"]] = approval_data

    def get_approval(self, approval_id: str) -> Optional[Dict[str, Any]]:
        with self._lock:
            return self._approvals.get(approval_id)

    def get_all_approvals(self) -> List[Dict[str, Any]]:
        with self._lock:
            return list(self._approvals.values())


# Global singleton instance
plan_store = PlanStore()
