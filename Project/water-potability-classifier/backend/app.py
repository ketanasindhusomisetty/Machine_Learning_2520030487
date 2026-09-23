
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

import pandas as pd
import numpy as np
import joblib
import json
import os


# ============================================
# FastAPI Application
# ============================================

app = FastAPI(
    title="Water Quality Classification API",
    description=(
        "ML-based Water Quality Classification "
        "using final Random Forest and SVM models"
    ),
    version="2.0.0"
)

# ============================================
# CORS
# ============================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)




# ============================================
# Paths
# ============================================

BASE_DIR = os.path.dirname(
    os.path.abspath(__file__)
)

MODEL_DIR = os.path.join(
    BASE_DIR,
    "models"
)


# ============================================
# Load FINAL Models
# ============================================

rf_model = joblib.load(
    os.path.join(
        MODEL_DIR,
        "random_forest_water_quality_FINAL.pkl"
    )
)

svm_model = joblib.load(
    os.path.join(
        MODEL_DIR,
        "svm_water_quality_FINAL.pkl"
    )
)

# Ensure cross-version compatibility for scikit-learn SimpleImputer
for _m in [rf_model, svm_model]:
    _imputer = _m.named_steps.get("imputer") if hasattr(_m, "named_steps") else None
    if _imputer and not hasattr(_imputer, "_fill_dtype"):
        _imputer._fill_dtype = getattr(_imputer, "_fit_dtype", "float64")



# ============================================
# Feature Names
# ============================================

feature_names = [
    "ph",
    "Hardness",
    "Solids",
    "Chloramines",
    "Sulfate",
    "Conductivity",
    "Organic_carbon",
    "Trihalomethanes",
    "Turbidity"
]


# ============================================
# Request Schema
# ============================================

class WaterQualityInput(BaseModel):

    ph: float | None = Field(
        default=None,
        ge=0,
        le=14
    )

    Hardness: float | None = Field(
        default=None,
        ge=0
    )

    Solids: float | None = Field(
        default=None,
        ge=0
    )

    Chloramines: float | None = Field(
        default=None,
        ge=0
    )

    Sulfate: float | None = Field(
        default=None,
        ge=0
    )

    Conductivity: float | None = Field(
        default=None,
        ge=0
    )

    Organic_carbon: float | None = Field(
        default=None,
        ge=0
    )

    Trihalomethanes: float | None = Field(
        default=None,
        ge=0
    )

    Turbidity: float | None = Field(
        default=None,
        ge=0
    )


# ============================================
# Root Endpoint
# ============================================

@app.get("/")
def root():

    return {
        "status": "success",

        "message":
            "Final Water Quality Classification API is running",

        "version":
            "2.0.0",

        "models": [
            "Final Random Forest",
            "Final Support Vector Machine"
        ]
    }


# ============================================
# Model Information
# ============================================

@app.get("/models")
def model_information():

    return {

        "models": {

            "random_forest": {
                "name": "Final Random Forest",
                "accuracy": 0.6723,
                "precision": 0.6519,
                "recall": 0.3438,
                "f1_score": 0.4501,
                "roc_auc": 0.6620
            },

            "svm": {
                "name": "Final SVM",
                "accuracy": 0.6692,
                "precision": 0.7010,
                "recall": 0.2656,
                "f1_score": 0.3853,
                "roc_auc": 0.6505
            }

        }

    }


# ============================================
# Prediction Endpoint
# ============================================

@app.post("/predict")
def predict_water_quality(
    data: WaterQualityInput
):

    try:

        input_data = data.model_dump()

        input_df = pd.DataFrame(
            [input_data],
            columns=feature_names
        )

        # Final models contain their own
        # preprocessing/imputation pipeline.

        # ========================================
        # Random Forest
        # ========================================

        rf_prediction = int(
            rf_model.predict(input_df)[0]
        )

        rf_probability = float(
            rf_model.predict_proba(
                input_df
            )[0, 1]
        )

        # ========================================
        # SVM
        # ========================================

        svm_prediction = int(
            svm_model.predict(input_df)[0]
        )

        svm_probability = float(
            svm_model.predict_proba(
                input_df
            )[0, 1]
        )

        # ========================================
        # Labels
        # ========================================

        rf_label = (
            "Potable"
            if rf_prediction == 1
            else "Not Potable"
        )

        svm_label = (
            "Potable"
            if svm_prediction == 1
            else "Not Potable"
        )

        models_agree = (
            rf_prediction == svm_prediction
        )

        return {

            "status":
                "success",

            "model_version":
                "FINAL",

            "random_forest": {

                "prediction":
                    rf_prediction,

                "classification":
                    rf_label,

                "potable_probability":
                    round(
                        rf_probability,
                        4
                    ),

                "potable_percentage":
                    round(
                        rf_probability * 100,
                        2
                    ),

                "not_potable_percentage":
                    round(
                        (1 - rf_probability) * 100,
                        2
                    )
            },

            "svm": {

                "prediction":
                    svm_prediction,

                "classification":
                    svm_label,

                "potable_probability":
                    round(
                        svm_probability,
                        4
                    ),

                "potable_percentage":
                    round(
                        svm_probability * 100,
                        2
                    ),

                "not_potable_percentage":
                    round(
                        (1 - svm_probability) * 100,
                        2
                    )
            },

            "model_agreement":
                models_agree,

            "agreement_status": (
                "Models agree"
                if models_agree
                else "Models disagree"
            )

        }

    except Exception as error:

        raise HTTPException(
            status_code=500,
            detail=str(error)
        )
