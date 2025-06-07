import { useState, useCallback } from "react"
import { useStocks } from "./StockContext"
import config from "./config.json"

const API_KEY = config.ALPHA_VANTAGE_API_KEY

const SYMBOLS = ["AAPL", "MSFT", "GOOG", "IBM", "AMZN", "TSLA", "META"]

export default function StockForm() {
  const { setStocks } = useStocks()
  const [form, setForm] = useState({ symbol: "IBM", quantity: "1", price: "12" })
  const [error, setError] = useState("")

  const fetchPrice = useCallback(async (symbol) => {
    const res = await fetch(
      `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`
    )
    const data = await res.json()
    return parseFloat(data["Global Quote"]?.["05. price"] || NaN)
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const { symbol, quantity, price } = form
    if (!symbol || !quantity || !price) return

    try {
      const currentPrice = await fetchPrice(symbol)
      if (isNaN(currentPrice)) {
        setError("Invalid stock symbol.")
        return
      }

      const newStock = {
        id: Date.now(),
        symbol,
        quantity: parseInt(quantity),
        purchasePrice: parseFloat(price),
        currentPrice,
      }

      setStocks((prev) => [...prev, newStock])
      setForm({ symbol: "", quantity: "", price: "" })
      setError("")
    } catch (err) {
      setError("Error fetching stock data.")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="stock-form">
      <select
        value={form.symbol}
        onChange={(e) => setForm((f) => ({ ...f, symbol: e.target.value }))}
        className="form-input"
      >
        <option value="">Select Symbol</option>
        {SYMBOLS.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
      <input
        type="number"
        placeholder="Quantity"
        className="form-input"
        value={form.quantity}
        onChange={(e) => setForm((f) => ({ ...f, quantity: e.target.value }))}
      />
      <input
        type="number"
        placeholder="Purchase Price (USD)"
        className="form-input"
        value={form.price}
        onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
      />
      <button type="submit" className="add-button">
        Add
      </button>
      {error && <p className="error-message">{error}</p>}
    </form>
  )
}
