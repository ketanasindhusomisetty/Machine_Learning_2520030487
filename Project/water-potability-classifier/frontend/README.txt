
WATER QUALITY CLASSIFICATION UI

Frontend:
- HTML
- CSS
- JavaScript
- Chart.js

Backend:
- FastAPI

Models:
- Random Forest
- Support Vector Machine

API:
http://127.0.0.1:8000

Prediction endpoint:
POST /predict

Start backend:
uvicorn app:app --host 0.0.0.0 --port 8000

Then serve this frontend through a local web server.

Example:
python -m http.server 5500

Open:
http://127.0.0.1:5500
