export default function StockItem({ symbol, quantity, purchasePrice, currentPrice }) {
  const profitLoss = (currentPrice - purchasePrice) * quantity
  const isProfit = profitLoss >= 0

  return (
    <div className="stock-item">
      <div className="stock-info">
        <div className="stock-symbol">{symbol}</div>
        <div className="stock-details">
          {quantity} shares @ ${purchasePrice.toFixed(2)} <br />
          Current: ${currentPrice.toFixed(2)}
        </div>
      </div>
      <div className={`stock-value ${isProfit ? "green" : "red"}`}>
        ${profitLoss.toFixed(2)}
        <div className="stock-price">{isProfit ? "Profit" : "Loss"}</div>
      </div>
    </div>
  )
}
