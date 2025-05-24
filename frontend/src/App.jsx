import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Hero from './components/Hero/Hero';
import LoginBox from './components/LoginBox/LoginBox';
import Signup from './components/Pages/Signup/Signup';
import Home from './components/Home/Home'; // Make sure you create this component
import Individual from './components/Pages/Individual/Individual';
import Institution from './components/Pages/Institution/Institution';

const App = () => {
  const [isHeroContentVisible, setHeroContentVisible] = useState(true);
  const [showLoginBox, setShowLoginBox] = useState(false);
  const [showSignupBox, setShowSignupBox] = useState(false);

  const handleLoginClick = () => {
    setHeroContentVisible(false);
    setShowLoginBox(true);
  };

  const handleCloseLoginBox = () => {
    setHeroContentVisible(true);
    setShowLoginBox(false);
  };

  const handleCloseSignupBox = () => {
    setHeroContentVisible(true);
    setShowSignupBox(false);
  };

  return (
    <Router>
      <div className="app-container">
        {/* Render Navbar only on the landing page */}
        <Routes>
          <Route path="/" element={
            <>
              <Navbar onLoginClick={handleLoginClick} />
              <Hero isVisible={isHeroContentVisible} />
              {showLoginBox && <LoginBox onClose={handleCloseLoginBox} />}
            </>
          } />
          <Route path="/signup" element={<Signup onClose={handleCloseSignupBox} />} />
          <Route path="/home" element={<Home />} />
          <Route path="*" element={<Navigate to="/" replace />} />
          <Route path="institution" element={<Institution/>}/>
          <Route path="individual" element={<Individual/>}/>
        </Routes>
      </div>
    </Router>
  );
};

export default App;