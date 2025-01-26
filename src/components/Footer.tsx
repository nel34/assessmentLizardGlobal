import React from 'react';
import '../styles/Footer.scss'; // Import global styles specific to the footer

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      {/* Footer section displaying copyright information */}
      <p>&copy; 2025 Lizard Global Assessment</p>
    </footer>
  );
};

export default Footer;

