"""
Alternative Plan Generator Engine
=================================
Deterministic rule-based alternative rescue plan generator for ResQShield AI.
Analyzes failed constraints from stress test simulations and failure diagnostics,
eliminates unsafe transit corridors or overloaded assets, and generates feasible
alternative plans with transparent operational reasoning.
Modular design ready for future ML/AI optimization algorithms.
"""

from typing import Dict, Any, Optional


class AlternativePlanGenerator:
    """
    Deterministic rule-based alternative rescue plan synthesis engine.
    """

    @staticmethod
    def generate(
        stress_test: Dict[str, Any],
        failure_analysis: Dict[str, Any],
        source_plan: Dict[str, Any]
    ) -> Dict[str, Any]:
        # 1. Read source plan parameters
        orig_route = source_plan.get("recommended_route", "Route B")
        orig_risk = int(source_plan.get("risk_score", 68))
        orig_rel = int(source_plan.get("reliability", 82))
        orig_time = int(source_plan.get("estimated_time", 42))
        orig_dist = float(source_plan.get("route_distance", 8.6))

        # 2. Read stress-test and failure-analysis constraints
        scenarios = [s.lower().replace("-", "_") for s in stress_test.get("selected_scenarios", [])]
        root_cause = failure_analysis.get("root_cause", "")

        # 3. Deterministic Alternative Route & Metric Synthesis
        # Default / Route Blockage case (the primary disaster stress scenario)
        if "route_blocked" in scenarios or not scenarios or "route blockage" in root_cause.lower():
            recommended_route = "Route C" if orig_route != "Route C" else "Route D"
            route_distance = round(orig_dist + 1.6, 1)  # 8.6 -> 10.2 km
            estimated_time = orig_time + 7              # 42 -> 49 min
            risk_score = max(15, orig_risk - 20)        # 68 -> 48
            reliability = min(98, orig_rel + 6)         # 82 -> 88
            resource_impact = "Uses additional travel distance but preserves battery reserve."
            reasoning = (
                "The original route was rejected because the simulated blockage caused excessive "
                "delay and resource consumption. The alternative route avoids the affected area "
                "and maintains sufficient operational resources."
            )

        elif "low_battery" in scenarios and len(scenarios) == 1:
            recommended_route = "Route B - Power Conservative"
            route_distance = round(orig_dist, 1)
            estimated_time = orig_time + 5
            risk_score = max(15, orig_risk - 18)
            reliability = min(98, orig_rel + 7)
            resource_impact = "Throttles propulsion velocity to conserve lead battery envelope."
            reasoning = (
                "The original plan was adjusted because vehicle power depletion exceeded emergency "
                "recovery thresholds. The alternative plan employs staged auxiliary recharge drones "
                "and conserves fleet propulsion margins."
            )

        elif "new_hazard" in scenarios and len(scenarios) == 1:
            recommended_route = "Route C - Embankment Bypass"
            route_distance = round(orig_dist + 2.0, 1)
            estimated_time = orig_time + 8
            risk_score = max(15, orig_risk - 22)
            reliability = min(98, orig_rel + 8)
            resource_impact = "Reroutes along dry high-elevation grade; eliminates electrical grid contact."
            reasoning = (
                "The original route approached an active electrified flood hazard zone. The alternative "
                "corridor utilizes a raised railway embankment to completely bypass the hazardous sector."
            )

        else:
            # Multi-vector / general compound alternative
            recommended_route = "Route C"
            route_distance = round(orig_dist + 1.6, 1)
            estimated_time = orig_time + 7
            risk_score = max(15, orig_risk - 20)
            reliability = min(98, orig_rel + 6)
            resource_impact = "Uses additional travel distance but preserves battery reserve."
            reasoning = (
                "The original route was rejected because the simulated blockage caused excessive "
                "delay and resource consumption. The alternative route avoids the affected area "
                "and maintains sufficient operational resources."
            )

        return {
            "recommended_route": recommended_route,
            "risk_score": risk_score,
            "reliability": reliability,
            "estimated_time": estimated_time,
            "route_distance": route_distance,
            "resource_impact": resource_impact,
            "reasoning": reasoning,
            "status": "READY_FOR_REVIEW",
            "human_approval_required": True
        }
