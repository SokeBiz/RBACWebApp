import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Navbar({ user, onLogout }) {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  const canAccessAdmin = user && user.permissions.includes('manage_users');
  const canCreateContent = user && user.permissions.includes('create_content');

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          <Link to="/dashboard" className="navbar-brand">
            RBAC Web App
          </Link>
          
          {user ? (
            <ul className="navbar-nav">
              <li>
                <Link 
                  to="/dashboard" 
                  className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link 
                  to="/content" 
                  className={`nav-link ${isActive('/content') ? 'active' : ''}`}
                >
                  Content
                </Link>
              </li>
              {canCreateContent && (
                <li>
                  <Link 
                    to="/create-content" 
                    className={`nav-link ${isActive('/create-content') ? 'active' : ''}`}
                  >
                    Create Content
                  </Link>
                </li>
              )}
              {canAccessAdmin && (
                <li>
                  <Link 
                    to="/admin" 
                    className={`nav-link ${isActive('/admin') ? 'active' : ''}`}
                  >
                    Admin Panel
                  </Link>
                </li>
              )}
              <li>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-600">
                    {user.name} 
                    <span className={`badge badge-${user.role} ml-2`}>
                      {user.role}
                    </span>
                  </span>
                  <button onClick={onLogout} className="btn btn-secondary">
                    Logout
                  </button>
                </div>
              </li>
            </ul>
          ) : (
            <ul className="navbar-nav">
              <li>
                <Link to="/login" className="nav-link">
                  Login
                </Link>
              </li>
            </ul>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
