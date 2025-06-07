import { createContext, useContext, useState, useEffect } from "react"

const StockContext = createContext()

export function StockProvider({ children }) {
  const [stocks, setStocks] = useState([])

  useEffect(() => {
    const saved = localStorage.getItem("financeStocks")
    if (saved) {
      setStocks(JSON.parse(saved))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("financeStocks", JSON.stringify(stocks))
  }, [stocks])

  return (
    <StockContext.Provider value={{ stocks, setStocks }}>
      {children}
    </StockContext.Provider>
  )
}

export function useStocks() {
  return useContext(StockContext)
}
