# 🌊 Water Potability Classifier
### ML-Based Water Quality Classification System

[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688.svg?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![Python](https://img.shields.io/badge/Python-3.10+-3776AB.svg?logo=python&logoColor=white)](https://www.python.org/)
[![scikit-learn](https://img.shields.io/badge/scikit--learn-1.6+-F7931E.svg?logo=scikit-learn&logoColor=white)](https://scikit-learn.org/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

## 📌 Project Overview

Access to safe drinking water is fundamental to public health, environmental safety, and socio-economic well-being. Conventional laboratory water quality testing often requires sophisticated chemical assays and extensive turnaround times that can delay vital public health interventions. The **ML-Based Water Quality Classification System** addresses this challenge by providing an end-to-end, automated machine learning solution to assess water potability. The primary objective of the project is to reliably classify water samples as either potable (safe for human consumption) or non-potable based on standard physicochemical parameters.

The system is trained and evaluated on a comprehensive dataset of 3,276 water samples across nine essential water quality features: pH, Hardness, Total Dissolved Solids (Solids), Chloramines, Sulfate, Conductivity, Organic Carbon, Trihalomethanes, and Turbidity. To ensure data integrity, the pipeline employs a stratified 80/20 train-test split (2,620 training and 656 testing samples) combined with median imputation to handle missing observations and standard feature scaling. Two complementary supervised learning algorithms were developed: an ensemble **Random Forest** classifier (achieving 67.23% test accuracy, 66.20% ROC-AUC, and 68.13% 5-fold cross-validation accuracy) and a **Support Vector Machine (SVM)** classifier (yielding 66.92% test accuracy, 65.05% ROC-AUC, and 70.10% precision).

Architecturally, the project is engineered as a production-ready, full-stack application. The backend is powered by a high-performance **FastAPI** service that exposes RESTful endpoints with Pydantic schema validation, CORS middleware, and scikit-learn inference pipelines for real-time predictions. The frontend features an interactive, modern dashboard created with HTML5, CSS3, JavaScript, and Chart.js. Users can input custom water measurements or load preconfigured sample presets to obtain instantaneous dual-model predictions, detailed class probabilities, confidence percentages, and a consensus agreement status.

Beyond single-sample inference, the dashboard provides comprehensive visual analytics, featuring interactive ROC curves, confusion matrices, cross-validation distributions, and feature importance rankings that identify pH, Sulfate, and Hardness as leading determinants of potability. By uniting robust machine learning pipelines with an intuitive web interface, this project serves as an interpretable, cost-effective decision-support tool for environmental monitoring, water treatment facilities, and public health screening.

---

### Target Classification:
- **`0` = Not Potable**
- **`1` = Potable**

## Dataset

Total samples: 3276
Input features: 9
Training samples: 2620
Testing samples: 656

Features:
pH
Hardness
Solids
Chloramines
Sulfate
Conductivity
Organic Carbon
Trihalomethanes
Turbidity

## Final Test Results

Random Forest:
Accuracy: 67.23%
Precision: 65.19%
Recall: 34.38%
F1-Score: 45.01%
ROC-AUC: 66.20%

SVM:
Accuracy: 66.92%
Precision: 70.10%
Recall: 26.56%
F1-Score: 38.53%
ROC-AUC: 65.05%

## Cross Validation

Random Forest 5-fold accuracy:
68.13% +/- 1.60%

SVM 5-fold accuracy:
67.90% +/- 1.47%

## Preprocessing

Missing numerical values are handled inside the model pipelines.
SVM uses feature scaling.
An 80/20 stratified train/test split is used.
The held-out test set is not used for hyperparameter tuning.

## Backend

FastAPI + Python + scikit-learn

Run:
pip install -r requirements.txt
uvicorn app:app --host 0.0.0.0 --port 8000

API endpoints:
GET /
GET /models
POST /predict

## Frontend

HTML + CSS + JavaScript + Chart.js

Run:
python -m http.server 5500

Open:
http://127.0.0.1:5500

## Dashboard

The dashboard contains:

- Water quality prediction
- Random Forest prediction
- SVM prediction
- Prediction probabilities
- Model agreement
- Accuracy
- Precision
- Recall
- F1-Score
- ROC-AUC
- Cross-validation results
- Confusion matrices
- ROC curve
- Feature importance
- Dataset statistics
- Hyperparameters

## Evaluation

This is a classification problem.
Accuracy, Precision, Recall, F1-Score and ROC-AUC are the primary evaluation metrics.
MSE and MAE are not used as primary model metrics.

## Important

Model predictions are estimates and are not laboratory measurements or regulatory certification of drinking-water safety.