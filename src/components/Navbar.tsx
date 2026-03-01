import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { to: '/', label: 'Dashboard', icon: 'bi-speedometer2' },
    { to: '/emotion-tracker', label: 'Emotion Tracker', icon: 'bi-emoji-smile' },
    { to: '/value-journal', label: 'Value Journal', icon: 'bi-journal-text' },
    { to: '/grace-library', label: 'GRACE Library', icon: 'bi-book' },
    { to: '/anonymous-chat', label: 'Anonymous Chat', icon: 'bi-chat-dots' },
    { to: '/grace-module', label: 'GRACE Module', icon: 'bi-flower1' },
    { to: '/about', label: 'About BridgeED', icon: 'bi-info-circle' },
  ];

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm sticky-top">
      <div className="container">
        <Link to="/" className="navbar-brand fw-bold d-flex align-items-center">
          <i className="bi bi-heart-pulse-fill me-2 fs-4"></i>
          <span>BridgeED</span>
        </Link>

        <button
          className="navbar-toggler border-0"
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-controls="navbarNav"
          aria-expanded={isOpen}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={`collapse navbar-collapse ${isOpen ? 'show' : ''}`} id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {navLinks.map((link) => (
              <li className="nav-item" key={link.to}>
                <NavLink
                  to={link.to}
                  className={({ isActive }) =>
                    `nav-link ${isActive ? 'active fw-semibold' : ''}`
                  }
                  onClick={() => setIsOpen(false)}
                >
                  <i className={`bi ${link.icon} me-1`}></i>
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="d-flex gap-2">
            <Link to="/login" className="btn btn-outline-light btn-sm">
              <i className="bi bi-box-arrow-in-right me-1"></i>
              Login
            </Link>
            <Link to="/register" className="btn btn-light btn-sm">
              <i className="bi bi-person-plus me-1"></i>
              Register
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
