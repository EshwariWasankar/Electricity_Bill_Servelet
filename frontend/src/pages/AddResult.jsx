import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SubjectRow from '../components/SubjectRow.jsx'
import { resultApi } from '../api/resultApi.js'

const emptySubject = () => ({ subjectName: '', subjectCode: '', mseMarks: '', eseMarks: '' })

const initialState = {
  studentName: '',
  registrationNumber: '',
  branch: '',
  semester: '',
  subjects: [emptySubject(), emptySubject(), emptySubject(), emptySubject()],
}

export default function AddResult() {
  const [form, setForm] = useState(initialState)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleField = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
  }

  const handleSubjectChange = (index, field, value) => {
    setForm((prev) => {
      const subjects = [...prev.subjects]
      subjects[index] = { ...subjects[index], [field]: value }
      return { ...prev, subjects }
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const payload = {
        ...form,
        subjects: form.subjects.map((s) => ({
          ...s,
          mseMarks: parseFloat(s.mseMarks),
          eseMarks: parseFloat(s.eseMarks),
        })),
      }
      const saved = await resultApi.createResult(payload)
      navigate(`/results/${saved.id}`)
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="sheet">
      <div className="sheet__intro">
        <span className="eyebrow">New Register Entry</span>
        <h1 className="sheet__title">Log a semester result</h1>
        <p className="sheet__lede">
          Enter marks for exactly four subjects. Each subject total is calculated as
          <strong> MSE &times; 30%</strong> (out of 50) plus <strong>ESE &times; 70%</strong> (out of 100).
        </p>
      </div>

      <form className="ledger-card" onSubmit={handleSubmit}>
        <div className="field-grid">
          <label className="field">
            <span className="field__label">Student name</span>
            <input
              className="ledger-input"
              type="text"
              value={form.studentName}
              onChange={handleField('studentName')}
              placeholder="e.g. Aarav Sharma"
              required
            />
          </label>
          <label className="field">
            <span className="field__label">Registration number</span>
            <input
              className="ledger-input ledger-input--mono"
              type="text"
              value={form.registrationNumber}
              onChange={handleField('registrationNumber')}
              placeholder="e.g. 22BCE1234"
              required
            />
          </label>
          <label className="field">
            <span className="field__label">Branch / School</span>
            <input
              className="ledger-input"
              type="text"
              value={form.branch}
              onChange={handleField('branch')}
              placeholder="e.g. SCOPE - CSE"
              required
            />
          </label>
          <label className="field">
            <span className="field__label">Semester</span>
            <input
              className="ledger-input"
              type="text"
              value={form.semester}
              onChange={handleField('semester')}
              placeholder="e.g. Fall Semester 2025-26"
              required
            />
          </label>
        </div>

        <div className="table-wrap">
          <table className="ledger-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Subject</th>
                <th>Code</th>
                <th>MSE (out of 50)</th>
                <th>ESE (out of 100)</th>
              </tr>
            </thead>
            <tbody>
              {form.subjects.map((subject, index) => (
                <SubjectRow key={index} index={index} subject={subject} onChange={handleSubjectChange} />
              ))}
            </tbody>
          </table>
        </div>

        {error && <p className="alert alert--error">{error}</p>}

        <div className="ledger-card__actions">
          <button className="btn btn--primary" type="submit" disabled={submitting}>
            {submitting ? 'Computing result…' : 'Compute & save result'}
          </button>
        </div>
      </form>
    </div>
  )
}
