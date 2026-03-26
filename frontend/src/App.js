import { useState } from "react";

function App() {
  const [ticker, setTicker] = useState("");
  const [stock, setStock] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchStock = async () => {
    if (!ticker) return;
    setLoading(true);
    const res = await fetch(`http://localhost:8000/stock/${ticker}`);
    const data = await res.json();
    setStock(data);
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: "600px", margin: "60px auto", fontFamily: "sans-serif" }}>
      <h1>Stock Dashboard</h1>
      <div style={{ display: "flex", gap: "10px", marginBottom: "30px" }}>
        <input
          style={{ flex: 1, padding: "10px", fontSize: "16px", borderRadius: "6px", border: "1px solid #ccc" }}
          placeholder="Enter ticker e.g. AAPL"
          value={ticker}
          onChange={(e) => setTicker(e.target.value.toUpperCase())}
          onKeyDown={(e) => e.key === "Enter" && fetchStock()}
        />
        <button
          style={{ padding: "10px 20px", fontSize: "16px", borderRadius: "6px", background: "#0070f3", color: "white", border: "none", cursor: "pointer" }}
          onClick={fetchStock}
        >
          Search
        </button>
      </div>

      {loading && <p>Loading...</p>}

      {stock && (
        <div style={{ background: "#f9f9f9", borderRadius: "10px", padding: "24px" }}>
          <h2>{stock.name} ({stock.ticker})</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginTop: "16px" }}>
            <div style={{ background: "white", padding: "16px", borderRadius: "8px", boxShadow: "0 1px 4px rgba(0,0,0,0.1)" }}>
              <p style={{ color: "#666", margin: 0 }}>Price</p>
              <p style={{ fontSize: "24px", fontWeight: "bold", margin: "4px 0 0" }}>${stock.price}</p>
            </div>
            <div style={{ background: "white", padding: "16px", borderRadius: "8px", boxShadow: "0 1px 4px rgba(0,0,0,0.1)" }}>
              <p style={{ color: "#666", margin: 0 }}>P/E Ratio</p>
              <p style={{ fontSize: "24px", fontWeight: "bold", margin: "4px 0 0" }}>{stock.pe_ratio?.toFixed(2)}</p>
            </div>
            <div style={{ background: "white", padding: "16px", borderRadius: "8px", boxShadow: "0 1px 4px rgba(0,0,0,0.1)" }}>
              <p style={{ color: "#666", margin: 0 }}>EPS</p>
              <p style={{ fontSize: "24px", fontWeight: "bold", margin: "4px 0 0" }}>${stock.eps}</p>
            </div>
            <div style={{ background: "white", padding: "16px", borderRadius: "8px", boxShadow: "0 1px 4px rgba(0,0,0,0.1)" }}>
              <p style={{ color: "#666", margin: 0 }}>Market Cap</p>
              <p style={{ fontSize: "24px", fontWeight: "bold", margin: "4px 0 0" }}>${(stock.market_cap / 1e9).toFixed(1)}B</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;