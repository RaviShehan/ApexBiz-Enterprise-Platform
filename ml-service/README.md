# ApexBiz ML Service

This service adds the data science part of the ApexBiz Enterprise Platform.

## Main Data Science Features

- Sales forecasting
- Inventory demand prediction
- Best-selling product analysis
- Slow-moving product analysis
- Low-stock risk analysis
- Sales anomaly detection

## Technology Stack

- Python
- FastAPI
- pandas
- NumPy
- scikit-learn

## How to Run

```bash
cd ml-service
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn app:app --reload --port 8000
```

ML service runs on:

```text
http://localhost:8000
```

Health check:

```text
http://localhost:8000/health
```

## Interview Explanation

ApexBiz includes a separate ML service for business intelligence and data science. It can analyze sales and inventory data, forecast demand, identify fast-moving and slow-moving products, detect low-stock risks, and detect unusual sales activity.
