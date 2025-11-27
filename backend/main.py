import os
from datetime import datetime
from typing import Dict, Optional
from uuid import uuid4

from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, field_validator
from sqlalchemy import JSON, Column, DateTime, Float, Integer, String, create_engine, func
from sqlalchemy.orm import Session, declarative_base, sessionmaker

# --------------------------------------------------------------------------------------
# Database setup
# --------------------------------------------------------------------------------------
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./ecocalc.db")

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {},
    future=True,
)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False, future=True)
Base = declarative_base()


class Calculation(Base):
    __tablename__ = "calculations"

    id = Column(String, primary_key=True, default=lambda: str(uuid4()))
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    payload = Column(JSON, nullable=False)
    scope1 = Column(Float, nullable=False)
    scope2 = Column(Float, nullable=False)
    scope3 = Column(Float, nullable=False)
    total = Column(Float, nullable=False)
    breakdown = Column(JSON, nullable=False)


class UsageSummary(Base):
    __tablename__ = "usage_summary"

    id = Column(Integer, primary_key=True, default=1)
    total_calculations = Column(Integer, nullable=False, default=0)
    total_emissions = Column(Float, nullable=False, default=0.0)
    last_calculation_at = Column(DateTime, nullable=True)
    last_total = Column(Float, nullable=True)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# --------------------------------------------------------------------------------------
# Domain models and helpers
# --------------------------------------------------------------------------------------
EMISSION_FACTORS: Dict[str, Dict[str, float]] = {
    "scope1": {
        "naturalGas": 2.02,
        "heatingOil": 3.19,
        "coal": 2.42,
        "diesel": 2.68,
        "petrol": 2.31,
        "refrigerants": 1810.0,
    },
    "scope2": {
        "electricity": 0.698,
        "districtHeating": 95.05,
    },
    "scope3": {
        "water": 0.344,
        "waste": 0.5,
        "airTravelShort": 0.255,
        "airTravelLong": 0.150,
        "railTravel": 0.041,
    },
}


class Scope1Inputs(BaseModel):
    naturalGas: float = Field(ge=0, default=0)
    heatingOil: float = Field(ge=0, default=0)
    coal: float = Field(ge=0, default=0)
    diesel: float = Field(ge=0, default=0)
    petrol: float = Field(ge=0, default=0)
    refrigerants: float = Field(ge=0, default=0)


class Scope2Inputs(BaseModel):
    electricity: float = Field(ge=0, default=0)
    districtHeating: float = Field(ge=0, default=0)


class Scope3Inputs(BaseModel):
    water: float = Field(ge=0, default=0)
    waste: float = Field(ge=0, default=0)
    airTravelShort: float = Field(ge=0, default=0)
    airTravelLong: float = Field(ge=0, default=0)
    railTravel: float = Field(ge=0, default=0)


class CalculatorPayload(BaseModel):
    scope1: Scope1Inputs
    scope2: Scope2Inputs
    scope3: Scope3Inputs

    @field_validator("*", mode="before")
    @classmethod
    def sanitize_numbers(cls, value):
        if isinstance(value, str) and value.strip() == "":
            return 0
        return value


class CalculationResponse(BaseModel):
    id: str
    date: datetime
    scope1: float
    scope2: float
    scope3: float
    total: float
    breakdown: Dict[str, float]

    class Config:
        from_attributes = True


class ScopeAverages(BaseModel):
    scope1: float
    scope2: float
    scope3: float


class UsageStatsResponse(BaseModel):
    totalCalculations: int
    totalEmissions: float
    averageEmission: float
    lastCalculationAt: Optional[datetime]
    lastTotal: Optional[float]
    scopeAverages: ScopeAverages


def calculate_emissions(payload: CalculatorPayload) -> CalculationResponse:
    s1 = payload.scope1
    s2 = payload.scope2
    s3 = payload.scope3

    def r(num: float) -> float:
        return round(float(num), 2)

    breakdown = {
        "naturalGas": s1.naturalGas * EMISSION_FACTORS["scope1"]["naturalGas"],
        "heatingOil": s1.heatingOil * EMISSION_FACTORS["scope1"]["heatingOil"],
        "coal": s1.coal * EMISSION_FACTORS["scope1"]["coal"],
        "diesel": s1.diesel * EMISSION_FACTORS["scope1"]["diesel"],
        "petrol": s1.petrol * EMISSION_FACTORS["scope1"]["petrol"],
        "refrigerants": s1.refrigerants * EMISSION_FACTORS["scope1"]["refrigerants"],
        "electricity": s2.electricity * EMISSION_FACTORS["scope2"]["electricity"],
        "districtHeating": s2.districtHeating * EMISSION_FACTORS["scope2"]["districtHeating"],
        "water": s3.water * EMISSION_FACTORS["scope3"]["water"],
        "waste": s3.waste * EMISSION_FACTORS["scope3"]["waste"],
        "airTravelShort": s3.airTravelShort * EMISSION_FACTORS["scope3"]["airTravelShort"],
        "airTravelLong": s3.airTravelLong * EMISSION_FACTORS["scope3"]["airTravelLong"],
        "railTravel": s3.railTravel * EMISSION_FACTORS["scope3"]["railTravel"],
    }

    scope1_total = (
        breakdown["naturalGas"]
        + breakdown["heatingOil"]
        + breakdown["coal"]
        + breakdown["diesel"]
        + breakdown["petrol"]
        + breakdown["refrigerants"]
    )
    scope2_total = breakdown["electricity"] + breakdown["districtHeating"]
    scope3_total = (
        breakdown["water"]
        + breakdown["waste"]
        + breakdown["airTravelShort"]
        + breakdown["airTravelLong"]
        + breakdown["railTravel"]
    )

    total = scope1_total + scope2_total + scope3_total

    rounded_breakdown = {k: r(v) for k, v in breakdown.items()}

    return CalculationResponse(
        id=str(uuid4()),
        date=datetime.utcnow(),
        scope1=r(scope1_total),
        scope2=r(scope2_total),
        scope3=r(scope3_total),
        total=r(total),
        breakdown=rounded_breakdown,
    )


# --------------------------------------------------------------------------------------
# FastAPI application
# --------------------------------------------------------------------------------------
app = FastAPI(title="Carbon Footprint Calculator API", version="1.0.0")

allowed_origins = os.getenv("ALLOWED_ORIGINS", "*")
origin_list = [origin.strip() for origin in allowed_origins.split(",")] if allowed_origins else ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(bind=engine)
    with SessionLocal() as db:
        summary = db.get(UsageSummary, 1)
        if not summary:
            summary = UsageSummary(id=1, total_calculations=0, total_emissions=0.0)
            db.add(summary)
            db.commit()


@app.get("/api/health")
def healthcheck():
    return {"status": "ok", "timestamp": datetime.utcnow()}


@app.post("/api/calculate", response_model=CalculationResponse)
def calculate(payload: CalculatorPayload, db: Session = Depends(get_db)):
    result = calculate_emissions(payload)

    calculation = Calculation(
        id=result.id,
        created_at=result.date,
        payload=payload.model_dump(),
        scope1=result.scope1,
        scope2=result.scope2,
        scope3=result.scope3,
        total=result.total,
        breakdown=result.breakdown,
    )
    db.add(calculation)

    summary = db.get(UsageSummary, 1)
    if summary is None:
        summary = UsageSummary(id=1, total_calculations=0, total_emissions=0.0)

    summary.total_calculations = (summary.total_calculations or 0) + 1
    summary.total_emissions = (summary.total_emissions or 0.0) + result.total
    summary.last_calculation_at = calculation.created_at
    summary.last_total = result.total

    db.add(summary)
    db.commit()

    return result


@app.get("/api/history", response_model=list[CalculationResponse])
def get_history(limit: int = 20, db: Session = Depends(get_db)):
    if limit > 100:
        raise HTTPException(status_code=400, detail="Limit cannot exceed 100 records.")

    calculations = (
        db.query(Calculation)
        .order_by(Calculation.created_at.desc())
        .limit(limit)
        .all()
    )

    return [
        CalculationResponse(
            id=item.id,
            date=item.created_at,
            scope1=item.scope1,
            scope2=item.scope2,
            scope3=item.scope3,
            total=item.total,
            breakdown=item.breakdown,
        )
        for item in calculations
    ]


@app.get("/api/stats", response_model=UsageStatsResponse)
def get_usage_stats(db: Session = Depends(get_db)):
    summary = db.get(UsageSummary, 1)
    if not summary:
        summary = UsageSummary(id=1, total_calculations=0, total_emissions=0.0)
        db.add(summary)
        db.commit()

    scope_averages = db.query(
        func.avg(Calculation.scope1).label("s1_avg"),
        func.avg(Calculation.scope2).label("s2_avg"),
        func.avg(Calculation.scope3).label("s3_avg"),
    ).one()

    total_calculations = summary.total_calculations or 0
    total_emissions = round(summary.total_emissions or 0.0, 2)
    average_emission = round(total_emissions / total_calculations, 2) if total_calculations > 0 else 0.0

    return UsageStatsResponse(
        totalCalculations=total_calculations,
        totalEmissions=total_emissions,
        averageEmission=average_emission,
        lastCalculationAt=summary.last_calculation_at,
        lastTotal=summary.last_total,
        scopeAverages=ScopeAverages(
            scope1=round(scope_averages.s1_avg or 0.0, 2),
            scope2=round(scope_averages.s2_avg or 0.0, 2),
            scope3=round(scope_averages.s3_avg or 0.0, 2),
        ),
    )

