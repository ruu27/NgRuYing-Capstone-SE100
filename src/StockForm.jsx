"use client"

import { useState, useCallback } from "react"
import { useStocks } from "./StockContext"
import config from "./config.json"

const API_KEY = config.ALPHA_VANTAGE_API_KEY

export default function StockForm() {
  const { setStocks } = useStocks()
  const [form, setForm] = useState({ symbol: "", quantity: "", price: "" })
  const [error, setError] = useState("")

  const fetchPrice = useCallback(async (symbol) => {
    const res = await fetch(
      `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`,
    )
    const data = await res.json()
    return Number.parseFloat(data["Global Quote"]?.["05. price"] || Number.NaN)
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const { symbol, quantity, price } = form

    // Validate inputs
    if (!symbol) {
      setError("Please enter a stock symbol.")
      return
    }

    if (!quantity || Number.parseInt(quantity) <= 0) {
      setError("Quantity must be a positive number.")
      return
    }

    if (!price || Number.parseFloat(price) <= 0) {
      setError("Purchase price must be a positive number.")
      return
    }

    try {
      const currentPrice = await fetchPrice(symbol)
      if (isNaN(currentPrice)) {
        setError("Invalid stock symbol.")
        return
      }

      const newStock = {
        id: Date.now(),
        symbol: symbol.toUpperCase(),
        quantity: Number.parseInt(quantity),
        purchasePrice: Number.parseFloat(price),
        currentPrice,
      }

      setStocks((prev) => [...prev, newStock])
      setForm({ symbol: "", quantity: "", price: "" })
      setError("")
    } catch (err) {
      setError("Error fetching stock data.")
    }
  }

  // Handle input change with validation
  const handleQuantityChange = (e) => {
    const value = e.target.value
    // Only allow positive numbers or empty string
    if (value === "" || Number.parseInt(value) > 0) {
      setForm((f) => ({ ...f, quantity: value }))
    }
  }

  const handlePriceChange = (e) => {
    const value = e.target.value
    // Only allow positive numbers or empty string
    if (value === "" || Number.parseFloat(value) > 0) {
      setForm((f) => ({ ...f, price: value }))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="stock-form">
      <input
        type="text"
        placeholder="Stock Symbol (e.g. AAPL)"
        className="form-input"
        value={form.symbol}
        onChange={(e) => setForm((f) => ({ ...f, symbol: e.target.value.toUpperCase() }))}
      />
      <input
        type="number"
        placeholder="Quantity"
        className="form-input"
        value={form.quantity}
        onChange={handleQuantityChange}
        min="1"
        step="1"
        onKeyDown={(e) => {
          // Prevent entering negative sign or decimal point
          if (e.key === "-" || e.key === ".") {
            e.preventDefault()
          }
        }}
      />
      <input
        type="number"
        placeholder="Purchase Price (USD)"
        className="form-input"
        value={form.price}
        onChange={handlePriceChange}
        min="0.01"
        step="0.01"
        onKeyDown={(e) => {
          // Prevent entering negative sign
          if (e.key === "-") {
            e.preventDefault()
          }
        }}
      />
      <button type="submit" className="add-button">
        Add
      </button>
      {error && <p className="error-message">{error}</p>}
    </form>
  )
}
