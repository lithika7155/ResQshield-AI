"""
Human Approval Route
====================
Safety Gate endpoint for ResQShield AI.
Enforces strict human-in-the-loop oversight before any generated alternative
rescue strategy is authorized for operational deployment.
"""

from datetime import datetime, timezone
from typing import Optional
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field

try:
    from services.plan_store import plan_store
except ImportError:
    from backend.services.plan_store import plan_store

router = APIRouter(
    tags=["Human Approval"]
)


class ApprovalRequest(BaseModel):
    alternative_plan_id: str = Field(..., description="ID of the alternative plan being evaluated", example="AP-001")
    decision: str = Field(..., description="Explicit human decision: APPROVE or REJECT", example="APPROVE")
    reviewer: str = Field(..., description="Name, callsign, or operational role of the human reviewer", example="Rescue Commander")
    comments: Optional[str] = Field(default="", description="Operational notes or rationale for the decision", example="Plan reviewed and approved for execution.")

    class Config:
        json_schema_extra = {
            "example": {
                "alternative_plan_id": "AP-001",
                "decision": "APPROVE",
                "reviewer": "Rescue Commander",
                "comments": "Plan reviewed and approved for execution."
            }
        }


class ApprovalResponse(BaseModel):
    approval_id: str = Field(..., description="Unique human approval audit record ID", example="HA-001")
    alternative_plan_id: str = Field(..., description="ID of the reviewed alternative plan", example="AP-001")
    decision: str = Field(..., description="Recorded human decision (APPROVED or REJECTED)", example="APPROVED")
    reviewer: str = Field(..., description="Human reviewer who signed off on the decision", example="Rescue Commander")
    status: str = Field(..., description="Post-approval execution lifecycle status", example="READY_FOR_EXECUTION")
    comments: str = Field(..., description="Reviewer comments and operational audit notes", example="Plan reviewed and approved for execution.")
    human_approval_required: bool = Field(default=True, description="Safety flag confirming human gate enforcement", example=True)


@router.post(
    "/api/approve-plan",
    response_model=ApprovalResponse,
    status_code=status.HTTP_200_OK,
    summary="Human Approval Safety Gate",
    description="Enforces final human authority on alternative rescue plans. Never allows automatic approval."
)
def approve_plan(request: ApprovalRequest):
    # 1. Read the alternative plan
    alt_plan = plan_store.get_alternative_plan(request.alternative_plan_id)
    if not alt_plan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Alternative plan '{request.alternative_plan_id}' not found. Please generate an alternative plan first via POST /api/alternative-plan."
        )

    # 2. Require an explicit human decision (never auto-approve)
    normalized_decision = request.decision.strip().upper()
    if normalized_decision not in ["APPROVE", "REJECT"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid decision '{request.decision}'. Allowed decisions are 'APPROVE' or 'REJECT'."
        )

    # 3. Determine status based on explicit decision
    if normalized_decision == "APPROVE":
        recorded_decision = "APPROVED"
        plan_status = "APPROVED"
        execution_status = "READY_FOR_EXECUTION"
        default_comments = "Plan reviewed and approved for execution."
    else:
        recorded_decision = "REJECTED"
        plan_status = "REJECTED"
        execution_status = "RECALCULATION_REQUIRED"
        default_comments = "Plan requires further review."

    comments = request.comments.strip() if request.comments and request.comments.strip() else default_comments

    # 4. Update the stored alternative plan status
    plan_store.update_alternative_plan_status(request.alternative_plan_id, plan_status)

    # 5. Generate and store audit record with timestamp
    approval_id = plan_store.get_next_approval_id()
    timestamp_utc = datetime.now(timezone.utc).isoformat()

    audit_record = {
        "approval_id": approval_id,
        "alternative_plan_id": request.alternative_plan_id,
        "decision": recorded_decision,
        "reviewer": request.reviewer,
        "status": execution_status,
        "comments": comments,
        "human_approval_required": True,
        "timestamp": timestamp_utc
    }
    plan_store.save_approval(audit_record)

    return ApprovalResponse(
        approval_id=approval_id,
        alternative_plan_id=request.alternative_plan_id,
        decision=recorded_decision,
        reviewer=request.reviewer,
        status=execution_status,
        comments=comments,
        human_approval_required=True
    )
