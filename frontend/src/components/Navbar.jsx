import { NavLink } from 'react-router-dom'

export default function Navbar() {
  return (
    <header className="ledger-header">
      <div className="ledger-header__inner">
        <div className="ledger-brand">
          <span className="ledger-brand__seal">VIT</span>
          <div className="ledger-brand__text">
            <span className="ledger-brand__title">Semester Result Register</span>
            <span className="ledger-brand__subtitle">Office of Academic Records</span>
          </div>
        </div>
        <nav className="ledger-nav">
          <NavLink to="/" end className={({ isActive }) => isActive ? 'ledger-nav__link is-active' : 'ledger-nav__link'}>
            New Entry
          </NavLink>
          <NavLink to="/results" className={({ isActive }) => isActive ? 'ledger-nav__link is-active' : 'ledger-nav__link'}>
            Register
          </NavLink>
        </nav>
      </div>
    </header>
  )
}
