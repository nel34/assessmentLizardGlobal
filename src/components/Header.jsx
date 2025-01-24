import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Header.css'; // Header-specific styles

function Header() {
  return (
    <header className="header">
      <h1>
        <Link to="/" className="header-link">
          Posts
        </Link>
      </h1>
    </header>
  );
}

export default Header;
