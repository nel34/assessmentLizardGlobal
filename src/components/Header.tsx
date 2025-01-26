import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Header.scss'; // Import styles specific to the header

const Header: React.FC = () => {
  return (
    <header className="header">
      {/* Main title of the application wrapped in a header tag */}
      <h1>
        {/* Link to navigate back to the main page */}
        <Link to="/" className="header-link">
          Posts
        </Link>
      </h1>
    </header>
  );
};

export default Header;

