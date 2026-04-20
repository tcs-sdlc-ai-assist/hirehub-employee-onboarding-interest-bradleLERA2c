import React, { useState, useCallback } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useSession } from '../hooks/useSession';

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isAuthenticated, logout } = useSession();
  const navigate = useNavigate();

  const toggleMenu = useCallback(() => {
    setMenuOpen((prev) => !prev);
  }, []);

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
  }, []);

  const handleLoginClick = useCallback(() => {
    closeMenu();
    navigate('/admin');
  }, [navigate, closeMenu]);

  const handleLogoutClick = useCallback(() => {
    logout();
    closeMenu();
    navigate('/');
  }, [logout, navigate, closeMenu]);

  const getNavLinkClass = ({ isActive }) => {
    return isActive ? 'header-nav-link active' : 'header-nav-link';
  };

  return (
    <header className="header">
      <div className="container">
        <NavLink to="/" className="header-logo" onClick={closeMenu}>
          <span role="img" aria-label="HireHub logo">💼</span>
          <span>Hire</span>Hub
        </NavLink>

        <nav className={menuOpen ? 'header-nav open' : 'header-nav'}>
          <NavLink
            to="/"
            end
            className={getNavLinkClass}
            onClick={closeMenu}
          >
            Home
          </NavLink>
          <NavLink
            to="/apply"
            className={getNavLinkClass}
            onClick={closeMenu}
          >
            Apply
          </NavLink>
          <NavLink
            to="/admin"
            className={getNavLinkClass}
            onClick={closeMenu}
          >
            Admin
          </NavLink>

          {isAuthenticated ? (
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={handleLogoutClick}
            >
              Logout
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={handleLoginClick}
            >
              Login
            </button>
          )}
        </nav>

        <button
          type="button"
          className="header-menu-toggle"
          onClick={toggleMenu}
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={menuOpen}
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>
    </header>
  );
}

export default Header;