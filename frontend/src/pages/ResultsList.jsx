import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { resultApi } from '../api/resultApi.js'

export default function ResultsList() {
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')

  useEffect(() => {
    let ignore = false
    resultApi
      .getAllResults()
      .then((data) => { if (!ignore) setResults(data) })
      .catch((err) => { if (!ignore) setError(err.message) })
      .finally(() => { if (!ignore) setLoading(false) })
    return () => { ignore = true }
  }, [])

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this entry from the register? This cannot be undone.')) return
    try {
      await resultApi.deleteResult(id)
      setResults((prev) => prev.filter((r) => r.id !== id))
    } catch (err) {
      setError(err.message)
    }
  }

  const filtered = results.filter((r) => {
    const q = query.toLowerCase()
    return (
      r.studentName?.toLowerCase().includes(q) ||
      r.registrationNumber?.toLowerCase().includes(q)
    )
  })

  return (
    <div className="sheet">
      <div className="sheet__intro">
        <span className="eyebrow">Academic Register</span>
        <h1 className="sheet__title">All logged results</h1>
        <p className="sheet__lede">Every entry ever computed, most recent first. Search by name or registration number.</p>
      </div>

      <input
        className="ledger-input search-input"
        type="text"
        placeholder="Search by name or reg. no…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {loading && <p className="muted">Loading register…</p>}
      {error && <p className="alert alert--error">{error}</p>}

      {!loading && !error && filtered.length === 0 && (
        <div className="empty-state">
          <p>No entries yet. Log your first result to see it here.</p>
          <Link className="btn btn--primary" to="/">New entry</Link>
        </div>
      )}

      {!loading && filtered.length > 0 && (
        <div className="table-wrap">
          <table className="ledger-table ledger-table--list">
            <thead>
              <tr>
                <th>Reg. No.</th>
                <th>Student</th>
                <th>Semester</th>
                <th>%</th>
                <th>SGPA</th>
                <th>Result</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {[...filtered].reverse().map((r) => (
                <tr key={r.id} className="entry-row">
                  <td className="mono">{r.registrationNumber}</td>
                  <td>{r.studentName}</td>
                  <td>{r.semester}</td>
                  <td className="mono">{r.percentage?.toFixed(2)}</td>
                  <td className="mono">{r.sgpa?.toFixed(2)}</td>
                  <td>
                    <span className={`status-pill ${r.overallResult === 'PASS' ? 'status-pill--pass' : 'status-pill--fail'}`}>
                      {r.overallResult}
                    </span>
                  </td>
                  <td className="row-actions">
                    <Link className="btn btn--ghost btn--small" to={`/results/${r.id}`}>View</Link>
                    <button className="btn btn--ghost btn--small btn--danger" onClick={() => handleDelete(r.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
