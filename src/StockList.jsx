import { useStocks } from "./StockContext"

export default function StockList() {
  const { stocks } = useStocks()
  if (stocks.length === 0) return <p className="empty-message">No stocks added yet.</p>

  const formatCurrency = (num) => {
    if (num < 0) {
      return `-$${Math.abs(num).toFixed(2)}`
    }
    return `$${num.toFixed(2)}`
  }
  const formatDate = (id) => new Date(id).toLocaleString("en-GB")

  const totalSpend = stocks.reduce((sum, s) => sum + s.quantity * s.purchasePrice, 0)
  const totalCurrent = stocks.reduce((sum, s) => sum + s.quantity * s.currentPrice, 0)
  const totalProfitLoss = totalCurrent - totalSpend

  const summaryMap = stocks.reduce((acc, stock) => {
    acc[stock.symbol] = (acc[stock.symbol] || 0) + stock.quantity
    return acc
  }, {})

  return (
    <>
      <h2>Total</h2>
      <div
        className="total-summary"
        style={{
          backgroundColor: "#e0f0ff",
          padding: "12px",
          borderRadius: "6px",
          marginBottom: "20px",
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ textAlign: "left", borderBottom: "1px solid #ccc" }}>
              <th style={{ padding: "6px" }}>Stock</th>
              <th style={{ padding: "6px" }}>Quantity</th>
              <th style={{ padding: "6px" }}>Total Spend</th>
              <th style={{ padding: "6px" }}>Total Profit/Loss</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(summaryMap).map(([symbol, quantity]) => {
              const stockSpend = stocks
                .filter((s) => s.symbol === symbol)
                .reduce((sum, s) => sum + s.quantity * s.purchasePrice, 0)
              const stockCurrent = stocks
                .filter((s) => s.symbol === symbol)
                .reduce((sum, s) => sum + s.quantity * s.currentPrice, 0)
              const stockProfitLoss = stockCurrent - stockSpend
              return (
                <tr key={symbol} style={{ borderBottom: "1px solid #eee" }}>
                  <td style={{ padding: "6px" }}>{symbol}</td>
                  <td style={{ padding: "6px" }}>{quantity}</td>
                  <td style={{ padding: "6px" }}>{formatCurrency(stockSpend)}</td>
                  <td style={{ padding: "6px", color: stockProfitLoss >= 0 ? "green" : "red" }}>
                    {formatCurrency(stockProfitLoss)}
                  </td>
                </tr>
              )
            })}
            <tr>
              <td colSpan={2} style={{ padding: "6px", fontWeight: "bold" }}>
                Total
              </td>
              <td style={{ padding: "6px", fontWeight: "bold" }}>{formatCurrency(totalSpend)}</td>
              <td style={{ padding: "6px", fontWeight: "bold", color: totalProfitLoss >= 0 ? "green" : "red" }}>
                {formatCurrency(totalProfitLoss)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="stock-list-section">
        <h2>Stock List</h2>
        <div className="stock-list">
          {stocks.map(({ id, symbol, quantity, purchasePrice, currentPrice }) => {
            const profitLoss = (currentPrice - purchasePrice) * quantity
            const shareLabel = quantity === 1 ? "share" : "shares"

            return (
              <div key={id} className="stock-item">
                {/* Timestamp */}
                <div className="timestamp">{formatDate(id)}</div>

                {/* Stock symbol */}
                <div className="stock-symbol">
                  <p>{symbol}</p>
                  {/* Stock details */}
                  <div className="stock-details">
                    <p>
                      {quantity} {shareLabel} @ {formatCurrency(purchasePrice)}
                    </p>
                    <p>Current: {formatCurrency(currentPrice)}</p>
                  </div>
                  {/* Profit / Loss */}
                  <div className="stock-profit-loss">
                    Profit / Loss{" "}
                    <span style={{ fontWeight: "bold", color: profitLoss >= 0 ? "green" : "red" }}>
                      {formatCurrency(profitLoss)}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}
