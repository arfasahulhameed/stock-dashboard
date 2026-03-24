from fastapi import FastAPI
import yfinance as yf

app = FastAPI()

@app.get("/")
def root():
    return {"message": "Stock dashboard API is running"}

@app.get("/stock/{ticker}")
def get_stock(ticker: str):
    stock = yf.Ticker(ticker)
    info = stock.info
    return {
        "ticker": ticker.upper(),
        "price": info.get("currentPrice"),
        "pe_ratio": info.get("trailingPE"),
        "eps": info.get("trailingEps"),
        "market_cap": info.get("marketCap"),
        "name": info.get("longName"),
    }