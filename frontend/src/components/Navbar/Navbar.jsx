import React from 'react';
import './Navbar.css';
import { Button } from '@mui/material';
import logo from '../../assets/LOGO.png';

const Navbar = ({ onLoginClick }) => {
  return (
    <nav className='navbar-container'>
      <div className='logo-container'>
        <img src={logo} alt="Grade Predict" className='logo' />
      </div>
      
      <div className='nav-buttons'>
        <Button 
          variant="outlined"
          className='login-btn' 
          onClick={onLoginClick}>
          LOGIN
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;