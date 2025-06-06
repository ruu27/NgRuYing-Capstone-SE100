"use client"

import "./App.css"
import { useState, useEffect } from "react"

function App() {
  // State for form data
  const [formData, setFormData] = useState({
    symbol: "",
    quantity: "",
    price: "",
  })

  // State for stocks list
  const [stocks, setStocks] = useState([])

  // Handle form input changes
  function handleInputChange(field, value) {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  // Handle form submission
  function handleSubmit(e) {
    e.preventDefault()

    if (formData.symbol && formData.quantity && formData.price) {
      const newStock = {
        id: Date.now(),
        symbol: formData.symbol.toUpperCase(),
        quantity: Number.parseInt(formData.quantity),
        price: Number.parseFloat(formData.price),
        total: Number.parseInt(formData.quantity) * Number.parseFloat(formData.price),
      }

      setStocks((prev) => [...prev, newStock])

      // Reset form
      setFormData({
        symbol: "",
        quantity: "",
        price: "",
      })
    }
  }

  // Load stocks from localStorage on component mount
  useEffect(() => {
    console.log("Loading stocks from localStorage")
    const savedStocks = localStorage.getItem("financeStocks")
    if (savedStocks) {
      setStocks(JSON.parse(savedStocks))
    }
  }, [])

  // Save stocks to localStorage whenever stocks change
  useEffect(() => {
    console.log("Saving stocks to localStorage")
    localStorage.setItem("financeStocks", JSON.stringify(stocks))
  }, [stocks])

  return (
    <>
      <div className="dashboard-container">
        <h1>Finance Dashboard</h1>

        <form className="stock-form" onSubmit={handleSubmit}>
          <input
            type="text"
            className="form-input"
            placeholder="Stock Symbol (e.g., AAPL)"
            value={formData.symbol}
            onChange={(e) => handleInputChange("symbol", e.target.value.toUpperCase())}
          />

          <input
            type="number"
            className="form-input"
            placeholder="Quantity"
            value={formData.quantity}
            onChange={(e) => handleInputChange("quantity", e.target.value)}
            min="1"
            step="1"
          />

          <input
            type="number"
            className="form-input"
            placeholder="Price per Share"
            value={formData.price}
            onChange={(e) => handleInputChange("price", e.target.value)}
            min="0"
            step="0.01"
          />

          <button type="submit" className="add-button">
            Add Stock
          </button>
        </form>

        <div className="stock-list-section">
          <h2>Stock List</h2>

          {stocks.length === 0 ? (
            <p className="empty-message">No stocks added yet.</p>
          ) : (
            <div className="stock-list">
              {stocks.map((stock) => (
                <div key={stock.id} className="stock-item">
                  <div className="stock-info">
                    <div className="stock-symbol">{stock.symbol}</div>
                    <div className="stock-details">
                      {stock.quantity} shares @ ${stock.price.toFixed(2)}
                    </div>
                  </div>
                  <div className="stock-value">
                    <div className="stock-total">${stock.total.toFixed(2)}</div>
                    <div className="stock-price">Total Value</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default App
