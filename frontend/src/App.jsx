import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import AddResult from './pages/AddResult.jsx'
import ResultsList from './pages/ResultsList.jsx'
import ResultDetail from './pages/ResultDetail.jsx'

export default function App() {
  return (
    <div className="page">
      <Navbar />
      <main className="page__content">
        <Routes>
          <Route path="/" element={<AddResult />} />
          <Route path="/results" element={<ResultsList />} />
          <Route path="/results/:id" element={<ResultDetail />} />
        </Routes>
      </main>
      <footer className="ledger-footer">
        Entries are computed as MSE (30%) + ESE (70%) per subject, across four subjects.
      </footer>
    </div>
  )
}
