"""
ResQShield AI - Backend Application
====================================
FastAPI-powered backend for AI-assisted disaster response verification,
stress testing, failure analysis, alternative plan generation, and human approval.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Initialize the FastAPI application
app = FastAPI(
    title="ResQShield AI API",
    description="Emergency Disaster Response Plan Verification and Stress-Testing Backend",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# Configure CORS for local development with React frontend
origins = [
    "http://localhost:3000",
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Import and include routers
try:
    from routes.rescue_plan import router as rescue_plan_router
    from routes.stress_test import router as stress_test_router
    from routes.failure_analysis import router as failure_analysis_router
    from routes.alternative_plan import router as alternative_plan_router
    from routes.approval import router as approval_router
except ImportError:
    from backend.routes.rescue_plan import router as rescue_plan_router
    from backend.routes.stress_test import router as stress_test_router
    from backend.routes.failure_analysis import router as failure_analysis_router
    from backend.routes.alternative_plan import router as alternative_plan_router
    from backend.routes.approval import router as approval_router

app.include_router(rescue_plan_router)
app.include_router(stress_test_router)
app.include_router(failure_analysis_router)
app.include_router(alternative_plan_router)
app.include_router(approval_router)


@app.get(
    "/api/health",
    tags=["System"],
    summary="System Health Check",
    response_description="Returns the operational status of the ResQShield AI backend",
)
def health_check():
    """
    Health check endpoint to verify backend operational readiness.
    Used by frontend and monitoring systems.
    """
    return {
        "status": "online",
        "system": "ResQShield AI",
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
