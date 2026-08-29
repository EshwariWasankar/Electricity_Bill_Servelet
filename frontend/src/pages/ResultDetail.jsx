import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { resultApi } from '../api/resultApi.js'

export default function ResultDetail() {
  const { id } = useParams()
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    let ignore = false
    resultApi
      .getResultById(id)
      .then((data) => { if (!ignore) setResult(data) })
      .catch((err) => { if (!ignore) setError(err.message) })
    return () => { ignore = true }
  }, [id])

  if (error) return <div className="sheet"><p className="alert alert--error">{error}</p></div>
  if (!result) return <div className="sheet"><p className="muted">Retrieving entry…</p></div>

  const isPass = result.overallResult === 'PASS'

  return (
    <div className="sheet">
      <Link className="back-link" to="/results">&larr; Back to register</Link>

      <div className="transcript">
        <div className="transcript__main">
          <div className="transcript__head">
            <div>
              <span className="eyebrow">Semester Result</span>
              <h1 className="sheet__title sheet__title--tight">{result.studentName}</h1>
              <p className="transcript__meta">
                <span className="mono">{result.registrationNumber}</span> · {result.branch} · {result.semester}
              </p>
            </div>
          </div>

          <div className="table-wrap">
            <table className="ledger-table">
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Code</th>
                  <th>MSE (30%)</th>
                  <th>ESE (70%)</th>
                  <th>Total / 100</th>
                  <th>Grade</th>
                </tr>
              </thead>
              <tbody>
                {result.subjects.map((s, i) => (
                  <tr key={i} className="entry-row">
                    <td>{s.subjectName}</td>
                    <td className="mono">{s.subjectCode}</td>
                    <td className="mono">{s.mseMarks} &rarr; {s.mseWeighted?.toFixed(2)}</td>
                    <td className="mono">{s.eseMarks} &rarr; {s.eseWeighted?.toFixed(2)}</td>
                    <td className="mono strong">{s.subjectTotal?.toFixed(2)}</td>
                    <td>
                      <span className={`status-pill ${s.subjectPass ? 'status-pill--pass' : 'status-pill--fail'}`}>
                        {s.subjectGrade}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="summary-strip">
            <div className="summary-strip__item">
              <span className="summary-strip__label">Total marks</span>
              <span className="summary-strip__value mono">{result.totalMarks?.toFixed(2)} / 400</span>
            </div>
            <div className="summary-strip__item">
              <span className="summary-strip__label">Percentage</span>
              <span className="summary-strip__value mono">{result.percentage?.toFixed(2)}%</span>
            </div>
            <div className="summary-strip__item">
              <span className="summary-strip__label">SGPA</span>
              <span className="summary-strip__value mono">{result.sgpa?.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="seal-panel">
          <div className={`seal ${isPass ? 'seal--pass' : 'seal--fail'}`}>
            <span className="seal__ring">
              <span className="seal__result">{result.overallResult}</span>
              <span className="seal__grade">{result.overallGrade}</span>
            </span>
          </div>
          <p className="seal-panel__reg mono">{result.registrationNumber}</p>
          <p className="seal-panel__note">
            {isPass
              ? 'All four subjects meet the minimum passing total.'
              : 'One or more subjects fell below the passing total of 40.'}
          </p>
        </div>
      </div>
    </div>
  )
}
