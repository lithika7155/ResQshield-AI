"""
Failure Analysis Engine
=======================
Deterministic rule-based root cause and failure chain analyzer for ResQShield AI.
Investigates completed stress test simulations to evaluate:
- Root cause
- Failure cascade propagation
- Affected operational resources
- Operational impact on rescue missions
- Criticality status and recommendations
Modular design to enable future ML/LLM diagnostic integration.
"""

from typing import Dict, Any, List, Optional


class FailureAnalyzer:
    """
    Deterministic rule-based failure analysis service.
    Analyzes stress test parameters, cascading failure chains,
    and plan resource states.
    """

    @staticmethod
    def analyze(stress_test: Dict[str, Any], plan: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        scenarios = stress_test.get("selected_scenarios", [])
        failure_chain = stress_test.get("failure_chain", [])
        simulated_risk = stress_test.get("simulated_risk", 80)
        simulated_rel = stress_test.get("simulated_reliability", 50)

        # Normalize scenario keys
        scenarios_lower = [s.strip().lower().replace("-", "_") for s in scenarios]

        # Case 1: Route blockage (single or compound with route_blocked)
        if "route_blocked" in scenarios_lower or not scenarios_lower:
            status = "CRITICAL"
            root_cause = "Route blockage caused a major detour."
            chain = [
                "Route Blocked",
                "Detour Required",
                "Travel Time Increased",
                "Battery Consumption Increased",
                "Medical Arrival Delayed",
                "Mission Risk Increased"
            ]
            affected_resources = [
                "Vehicle Battery",
                "Fuel",
                "Medical Resources",
                "Rescue Team Time"
            ]
            operational_impact = "Rescue arrival is significantly delayed and available energy reserves are reduced."
            recommendation = "Generate and evaluate an alternative rescue plan."

        # Case 2: Low battery / power depletion alone
        elif "low_battery" in scenarios_lower:
            status = "CRITICAL" if simulated_risk >= 85 else "HIGH"
            root_cause = "Extreme cold-water immersion and high current drag caused critical battery exhaustion."
            chain = failure_chain or [
                "Sub-zero Water Shock",
                "Thruster Power Throttled",
                "Payload Drag Increase",
                "Return Trip Unviable",
                "Mission Risk Increased"
            ]
            affected_resources = [
                "Autonomous Fleet Battery",
                "Thruster Motors",
                "Payload Hauling Capacity",
                "Rescue Team Time"
            ]
            operational_impact = "Fleet propulsion throttled to survival speeds; autonomous vehicles risk mid-route stranding before return."
            recommendation = "Deploy secondary battery tender drone or reallocate payload to alternative watercraft."

        # Case 3: Signal loss alone
        elif "signal_loss" in scenarios_lower:
            status = "HIGH"
            root_cause = "Submerged telemetry relay station severed tactical mesh radio link."
            chain = failure_chain or [
                "Relay Mast Inundated",
                "Tele-operation Severed",
                "Autonomous Halt Protocol",
                "Coordination Desync",
                "Mission Risk Increased"
            ]
            affected_resources = [
                "Tactical Mesh Radio Link",
                "Autonomous Navigation Feed",
                "Telemetry Sensors",
                "Rescue Team Coordination"
            ]
            operational_impact = "Autonomous fleet halted in failsafe protocol; operators lost real-time command feed of survivor haven."
            recommendation = "Deploy high-altitude aerial drone repeater to restore mesh communications corridor."

        # Case 4: New hazard alone
        elif "new_hazard" in scenarios_lower:
            status = "CRITICAL"
            root_cause = "Downed 13.8kV power distribution lines electrified flood approach waters."
            chain = failure_chain or [
                "Substation Surge Breach",
                "Hull Conductivity Risk",
                "No-Go Zone Triggered",
                "Complete Vector Abort",
                "Mission Risk Increased"
            ]
            affected_resources = [
                "Watercraft Hulls",
                "Primary Ingress Corridor",
                "Team Safety Envelopes",
                "Medical Response Units"
            ]
            operational_impact = "Primary approach declared a lethal hazard zone; immediate vector abort required to preserve team safety."
            recommendation = "Reroute immediately along high-elevation railway embankment outside flooded grid sector."

        # Case 5: Survivor location error alone
        elif "survivor_location_error" in scenarios_lower or "location_error" in scenarios_lower:
            status = "HIGH"
            root_cause = "Cellular triangulation drift caused 650m survivor coordinate discrepancy."
            chain = failure_chain or [
                "Triangulation Drift",
                "False Arrival Target",
                "Recon Search Expansion",
                "Surge Window Erosion",
                "Mission Risk Increased"
            ]
            affected_resources = [
                "Aerial Recon Drones",
                "Thermal Scanning Sensors",
                "Mission Golden Hour Margin",
                "Rescue Team Time"
            ]
            operational_impact = "Target extraction structure vacant; expanded spiral search depleted allocated mission window."
            recommendation = "Re-verify coordinates via multi-spectral thermal signature lock before secondary deployment."

        else:
            # General fallback based on metrics
            status = "CRITICAL" if simulated_risk >= 80 or simulated_rel <= 55 else "HIGH"
            root_cause = "Compound operational disruption compromised baseline mission parameters."
            chain = failure_chain or [
                "Environmental Disruption Detected",
                "Operational Parameter Exceeded",
                "Response Envelope Compromised",
                "Mission Risk Increased"
            ]
            affected_resources = [
                "Vehicle Fleet",
                "Fuel / Battery Reserves",
                "Medical Readiness",
                "Rescue Team Time"
            ]
            operational_impact = "Mission execution thresholds breached; risk to survivor stabilization exceeds safe margins."
            recommendation = "Generate and evaluate an alternative rescue plan."

        return {
            "status": status,
            "root_cause": root_cause,
            "failure_chain": chain,
            "affected_resources": affected_resources,
            "operational_impact": operational_impact,
            "recommendation": recommendation
        }
