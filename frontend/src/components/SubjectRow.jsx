export default function SubjectRow({ index, subject, onChange }) {
  const handle = (field) => (e) => {
    const value = e.target.value
    onChange(index, field, value)
  }

  return (
    <tr className="entry-row">
      <td className="entry-row__num">{String(index + 1).padStart(2, '0')}</td>
      <td>
        <input
          className="ledger-input"
          type="text"
          placeholder="e.g. Data Structures"
          value={subject.subjectName}
          onChange={handle('subjectName')}
          required
        />
      </td>
      <td>
        <input
          className="ledger-input ledger-input--mono"
          type="text"
          placeholder="CSE2001"
          value={subject.subjectCode}
          onChange={handle('subjectCode')}
          required
        />
      </td>
      <td>
        <input
          className="ledger-input ledger-input--mono ledger-input--num"
          type="number"
          min="0"
          max="50"
          step="0.5"
          placeholder="/ 50"
          value={subject.mseMarks}
          onChange={handle('mseMarks')}
          required
        />
      </td>
      <td>
        <input
          className="ledger-input ledger-input--mono ledger-input--num"
          type="number"
          min="0"
          max="100"
          step="0.5"
          placeholder="/ 100"
          value={subject.eseMarks}
          onChange={handle('eseMarks')}
          required
        />
      </td>
    </tr>
  )
}
