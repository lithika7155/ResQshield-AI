/**
 * ResQShield AI — Centralized API Service
 * ========================================
 * Abstracts all HTTP communication with the FastAPI backend.
 * Base URL: http://127.0.0.1:8000
 *
 * All functions return the parsed JSON response on success.
 * On HTTP or network errors, a structured Error is thrown with
 * { message, status, detail } so callers can display it cleanly.
 */

const BASE_URL = 'http://127.0.0.1:8000';

// ─── Shared Fetch Wrapper ─────────────────────────────────────────────────────
async function apiFetch(path, options = {}) {
  const url = `${BASE_URL}${path}`;
  const config = {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  };

  let response;
  try {
    response = await fetch(url, config);
  } catch (networkErr) {
    const err = new Error(
      'Cannot reach the ResQShield AI backend. ' +
      'Please make sure the FastAPI server is running on http://127.0.0.1:8000'
    );
    err.status = 0;
    err.detail = networkErr.message;
    throw err;
  }

  if (!response.ok) {
    let detail = `HTTP ${response.status}`;
    try {
      const body = await response.json();
      detail = body?.detail || detail;
    } catch (_) { /* body not JSON */ }
    const err = new Error(detail);
    err.status = response.status;
    err.detail = detail;
    throw err;
  }

  return response.json();
}

// ─── 1. Health Check ─────────────────────────────────────────────────────────
/**
 * GET /api/health
 * Returns { status, system }
 */
export async function checkHealth() {
  return apiFetch('/api/health');
}

// ─── 2. Generate Rescue Plan ─────────────────────────────────────────────────
/**
 * POST /api/generate-plan
 * @param {Object} params — fields required by the backend
 * @returns {Object} plan — { plan_id, status, disaster_type, location, risk_score,
 *                            reliability, estimated_time, route_distance, recommended_route }
 *
 * Frontend form fields → API fields mapping:
 *   disasterType          → disaster_type
 *   severity              → severity
 *   disasterZone/location → location
 *   estimatedCount        → survivors
 *   rescueTeams count     → rescue_teams
 *   vehicles count        → vehicles
 *   weatherCondition      → weather
 *   commStatus            → communication
 *   fuelBattery           → fuel_or_battery
 *   medicalSupplies level → medical_resources (default 75)
 *   activeHazards         → active_hazards
 *   nearestSafeZone       → safe_zone
 */
export async function generatePlan(formData) {
  // Parse numeric team count from text fields gracefully
  const teamCount = parseRescueTeamCount(formData.rescueTeams);
  const vehicleCount = parseVehicleCount(formData.vehicles);

  const payload = {
    disaster_type: formData.disasterType || 'Flood',
    severity: formData.severity || 'Critical',
    location: formData.disasterZone || formData.location || 'Unknown Location',
    survivors: parseInt(formData.estimatedCount, 10) || parseInt(formData.survivorCount, 10) || 100,
    rescue_teams: teamCount,
    vehicles: vehicleCount,
    weather: formData.weatherCondition || formData.weather || 'Heavy Rain',
    communication: formData.commStatus || formData.communication || 'Stable',
    fuel_or_battery: parseFloat(formData.fuelBattery) || 80,
    medical_resources: 75, // default when detailed breakdown not provided
    active_hazards: Array.isArray(formData.activeHazards) ? formData.activeHazards : [],
    safe_zone: formData.nearestSafeZone || formData.safeZone || 'Designated Shelter',
  };

  return apiFetch('/api/generate-plan', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

// ─── 3. Stress Test ──────────────────────────────────────────────────────────
/**
 * POST /api/stress-test
 * @param {string} planId          — plan_id from generatePlan response
 * @param {string[]} scenarioIds   — array of scenario IDs from the UI
 * @returns {Object} result        — { stress_test_id, status, original_risk, simulated_risk,
 *                                     original_reliability, simulated_reliability,
 *                                     original_time, simulated_time, failure_detected,
 *                                     failure_chain, resource_impact }
 */
export async function runStressTest(planId, scenarioIds) {
  // Normalize scenario IDs (e.g. UI uses survivor_error, backend expects survivor_location_error)
  const normalizedScenarios = (scenarioIds || []).map(id => 
    id === 'survivor_error' ? 'survivor_location_error' : id
  );

  const payload = {
    plan_id: planId,
    selected_scenarios: normalizedScenarios,
  };

  return apiFetch('/api/stress-test', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

// ─── 4. Failure Analysis ─────────────────────────────────────────────────────
/**
 * POST /api/failure-analysis
 * @param {string} stressTestId   — stress_test_id from runStressTest response
 * @returns {Object} analysis     — { analysis_id, stress_test_id, status, root_cause,
 *                                    failure_chain, affected_resources,
 *                                    operational_impact, recommendation }
 */
export async function runFailureAnalysis(stressTestId) {
  const payload = { stress_test_id: stressTestId };

  return apiFetch('/api/failure-analysis', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

// ─── 5. Alternative Plan ─────────────────────────────────────────────────────
/**
 * POST /api/alternative-plan
 * @param {string} stressTestId       — stress_test_id
 * @param {string} failureAnalysisId  — analysis_id
 * @returns {Object} altPlan          — { alternative_plan_id, source_plan_id, stress_test_id,
 *                                       status, recommended_route, risk_score, reliability,
 *                                       estimated_time, route_distance, resource_impact,
 *                                       reasoning, human_approval_required }
 */
export async function generateAlternativePlan(stressTestId, failureAnalysisId) {
  const payload = {
    stress_test_id: stressTestId,
    failure_analysis_id: failureAnalysisId,
  };

  return apiFetch('/api/alternative-plan', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

// ─── 6. Human Approval ───────────────────────────────────────────────────────
/**
 * POST /api/approve-plan
 * @param {string} alternativePlanId  — alternative_plan_id
 * @param {string} decision           — 'APPROVE' or 'REJECT'
 * @param {string} reviewer           — reviewer name / callsign
 * @param {string} comments           — optional reviewer notes
 * @returns {Object} approval         — { approval_id, alternative_plan_id, decision,
 *                                       reviewer, status, comments, human_approval_required }
 */
export async function approvePlan(alternativePlanId, decision, reviewer, comments = '') {
  const payload = {
    alternative_plan_id: alternativePlanId,
    decision: decision.toUpperCase(),
    reviewer: reviewer || 'Rescue Commander',
    comments: comments,
  };

  return apiFetch('/api/approve-plan', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Parse approximate rescue team count from a descriptive text string.
 * e.g. "NDRF 04 Battalion, SDRF Swift Water Unit 2" → 2 teams
 */
function parseRescueTeamCount(teamsStr) {
  if (!teamsStr) return 5;
  const num = parseInt(teamsStr, 10);
  if (!isNaN(num)) return num;
  // Count commas as team separators
  const commas = (teamsStr.match(/,/g) || []).length;
  return Math.max(1, commas + 1);
}

/**
 * Parse approximate vehicle count from descriptive text string.
 * e.g. "2 Amphibious UGVs, 4 RIB Boats, 2 Unimogs" → 8
 */
function parseVehicleCount(vehiclesStr) {
  if (!vehiclesStr) return 10;
  const num = parseInt(vehiclesStr, 10);
  if (!isNaN(num)) return num;
  // Sum all leading numbers in the string
  const nums = vehiclesStr.match(/\d+/g);
  if (nums) {
    const total = nums.reduce((sum, n) => sum + parseInt(n, 10), 0);
    return total > 0 ? Math.min(total, 30) : 5;
  }
  return 5;
}

export default {
  checkHealth,
  generatePlan,
  runStressTest,
  runFailureAnalysis,
  generateAlternativePlan,
  approvePlan,
};
