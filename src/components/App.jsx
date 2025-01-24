import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import MainPage from './MainPage';
import PostDetail from './PostDetail';
import '../styles/App.css'; // Global styles

function App() {
  return (
    <div className="container">
      <Router>
        {/* Header Component */}
        <Header />

        {/* Routing */}
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/post/:id" element={<PostDetail />} />
        </Routes>

        {/* Footer Component */}
        <Footer />
      </Router>
    </div>
  );
}

export default App;
