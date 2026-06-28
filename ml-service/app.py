from datetime import datetime, timedelta
from typing import List
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(
    title="ApexBiz ML Service",
    description="Lightweight data science service for sales forecasting, inventory prediction, and anomaly detection.",
    version="1.0.0",
)


class SaleItem(BaseModel):
    productId: str
    productName: str
    quantity: int
    totalAmountCents: int
    saleDate: str


class ProductStock(BaseModel):
    productId: str
    productName: str
    stockQuantity: int
    reorderLevel: int


class AnalyticsRequest(BaseModel):
    sales: List[SaleItem]
    products: List[ProductStock]


def parse_date(date_text: str):
    try:
        return datetime.fromisoformat(date_text.replace("Z", "+00:00")).date()
    except Exception:
        return datetime.utcnow().date()


def forecast_next_7_days(sales: List[SaleItem]):
    if not sales:
        return []

    daily_totals = {}

    for sale in sales:
        day = parse_date(sale.saleDate)
        daily_totals[day] = daily_totals.get(day, 0) + sale.totalAmountCents

    sorted_days = sorted(daily_totals.keys())
    values = [daily_totals[day] for day in sorted_days]

    if len(values) == 1:
        average = values[0]
        last_day = sorted_days[-1]

        return [
            {
                "date": (last_day + timedelta(days=i)).isoformat(),
                "predictedRevenueCents": average,
                "method": "average_baseline",
            }
            for i in range(1, 8)
        ]

    x_values = list(range(len(values)))
    x_mean = sum(x_values) / len(x_values)
    y_mean = sum(values) / len(values)

    numerator = sum((x - x_mean) * (y - y_mean) for x, y in zip(x_values, values))
    denominator = sum((x - x_mean) ** 2 for x in x_values)

    slope = numerator / denominator if denominator != 0 else 0
    intercept = y_mean - slope * x_mean

    last_index = len(values) - 1
    last_day = sorted_days[-1]

    forecast = []

    for i in range(1, 8):
        future_index = last_index + i
        predicted = intercept + slope * future_index

        forecast.append(
            {
                "date": (last_day + timedelta(days=i)).isoformat(),
                "predictedRevenueCents": max(round(predicted), 0),
                "method": "simple_linear_regression",
            }
        )

    return forecast


def product_performance(sales: List[SaleItem]):
    product_map = {}

    for sale in sales:
        if sale.productId not in product_map:
            product_map[sale.productId] = {
                "productId": sale.productId,
                "productName": sale.productName,
                "totalQuantitySold": 0,
                "totalRevenueCents": 0,
            }

        product_map[sale.productId]["totalQuantitySold"] += sale.quantity
        product_map[sale.productId]["totalRevenueCents"] += sale.totalAmountCents

    products = list(product_map.values())
    products_sorted = sorted(products, key=lambda item: item["totalQuantitySold"], reverse=True)

    return {
        "bestSellingProducts": products_sorted[:5],
        "slowMovingProducts": list(reversed(products_sorted[-5:])),
    }


def low_stock_risk(products: List[ProductStock], sales: List[SaleItem]):
    risks = []

    for product in products:
        product_sales = [sale for sale in sales if sale.productId == product.productId]

        if not product_sales:
            average_daily_demand = 0
        else:
            unique_days = len(set(parse_date(sale.saleDate) for sale in product_sales))
            total_quantity = sum(sale.quantity for sale in product_sales)
            average_daily_demand = total_quantity / max(unique_days, 1)

        if average_daily_demand > 0:
            estimated_days_remaining = product.stockQuantity / average_daily_demand
        else:
            estimated_days_remaining = None

        is_low_stock = product.stockQuantity <= product.reorderLevel
        will_run_out_soon = (
            estimated_days_remaining is not None and estimated_days_remaining <= 7
        )

        risks.append(
            {
                "productId": product.productId,
                "productName": product.productName,
                "stockQuantity": product.stockQuantity,
                "reorderLevel": product.reorderLevel,
                "averageDailyDemand": round(average_daily_demand, 2),
                "estimatedDaysRemaining": round(estimated_days_remaining, 2)
                if estimated_days_remaining is not None
                else None,
                "riskLevel": "HIGH" if is_low_stock or will_run_out_soon else "NORMAL",
                "suggestion": "Reorder soon"
                if is_low_stock or will_run_out_soon
                else "Stock level is acceptable",
            }
        )

    return risks


def detect_sales_anomalies(sales: List[SaleItem]):
    if len(sales) < 5:
        return []

    amounts = [sale.totalAmountCents for sale in sales]
    average = sum(amounts) / len(amounts)
    variance = sum((amount - average) ** 2 for amount in amounts) / len(amounts)
    standard_deviation = variance ** 0.5

    anomalies = []

    for sale in sales:
        if standard_deviation > 0:
            z_score = abs((sale.totalAmountCents - average) / standard_deviation)
        else:
            z_score = 0

        if z_score >= 2:
            anomalies.append(
                {
                    "productId": sale.productId,
                    "productName": sale.productName,
                    "quantity": sale.quantity,
                    "totalAmountCents": sale.totalAmountCents,
                    "saleDate": sale.saleDate,
                    "reason": "Unusual sales amount compared with normal sales",
                }
            )

    return anomalies


@app.get("/")
def root():
    return {
        "message": "ApexBiz ML Service is running",
        "docs": "/docs",
        "health": "/health",
        "analyticsEndpoint": "/analytics/business-insights",
    }


@app.get("/health")
def health_check():
    return {
        "status": "ok",
        "service": "ApexBiz ML Service",
        "timestamp": datetime.utcnow().isoformat(),
    }


@app.post("/analytics/business-insights")
def business_insights(request: AnalyticsRequest):
    performance = product_performance(request.sales)

    return {
        "salesForecastNext7Days": forecast_next_7_days(request.sales),
        "bestSellingProducts": performance["bestSellingProducts"],
        "slowMovingProducts": performance["slowMovingProducts"],
        "lowStockRisk": low_stock_risk(request.products, request.sales),
        "salesAnomalies": detect_sales_anomalies(request.sales),
        "generatedAt": datetime.utcnow().isoformat(),
    }
