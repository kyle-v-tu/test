import { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/fds-logo.png';

function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <nav>
      <div className="nav-logo">
        <img src={logo} alt="logo" />
      </div>

      {/* Desktop links */}
      <div className="links">
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/our-chapter">Our Chapter</Link>
        <Link to="/FAQs">FAQs</Link>

      </div>

      {/* Hamburger button */}
      <button
        className={`hamburger ${open ? 'open' : ''}`}
        onClick={() => setOpen(!open)}
        aria-label="Toggle menu"
      >
        <span />
        <span />
        <span />
      </button>

      {/* Mobile menu */}
      {open && (
        <div className="mobile-menu">
          <Link to="/" onClick={() => setOpen(false)}>Home</Link>
          <Link to="/about" onClick={() => setOpen(false)}>About</Link>
          <Link to="/our-chapter" onClick={() => setOpen(false)}>Our Chapter</Link>
          <Link to="/FAQs" onClick={() => setOpen(false)}>FAQs</Link>
        </div>
      )}
    </nav>
  );
}

export default Nav;