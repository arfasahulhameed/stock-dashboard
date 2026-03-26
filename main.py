from fastapi import FastAPI
import yfinance as yf
import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

def get_db():
    conn = psycopg2.connect(os.getenv("DATABASE_URL"))
    return conn

def setup_db():
    conn = get_db()
    cur = conn.cursor()
    cur.execute("""
        CREATE TABLE IF NOT EXISTS stocks (
            id SERIAL PRIMARY KEY,
            ticker TEXT NOT NULL,
            price FLOAT,
            pe_ratio FLOAT,
            eps FLOAT,
            market_cap BIGINT,
            name TEXT,
            fetched_at TIMESTAMP DEFAULT NOW()
        )
    """)
    conn.commit()
    cur.close()
    conn.close()

setup_db()

@app.get("/")
def root():
    return {"message": "Stock dashboard API is running"}

@app.get("/stock/{ticker}")
def get_stock(ticker: str):
    stock = yf.Ticker(ticker)
    info = stock.info

    price = info.get("currentPrice")
    pe_ratio = info.get("trailingPE")
    eps = info.get("trailingEps")
    market_cap = info.get("marketCap")
    name = info.get("longName")

    conn = get_db()
    cur = conn.cursor()
    cur.execute("""
        INSERT INTO stocks (ticker, price, pe_ratio, eps, market_cap, name)
        VALUES (%s, %s, %s, %s, %s, %s)
    """, (ticker.upper(), price, pe_ratio, eps, market_cap, name))
    conn.commit()
    cur.close()
    conn.close()

    return {
        "ticker": ticker.upper(),
        "price": price,
        "pe_ratio": pe_ratio,
        "eps": eps,
        "market_cap": market_cap,
        "name": name,
    }