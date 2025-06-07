import "./App.css"
import { StockProvider } from "./StockContext"
import StockForm from "./StockForm"
import StockList from "./StockList"

function App() {
  return (
    <StockProvider>
      <div className="dashboard-container">
        <h1>Finance Dashboard</h1>
        <StockForm />
        <StockList />
      </div>
    </StockProvider>
  )
}

export default App
