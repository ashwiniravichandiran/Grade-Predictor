import React from 'react';
import './Navbar.css';
import { Button } from '@mui/material';

const Navbar = ({ onLoginClick }) => {
  return (
    <nav className='container'>
      <ul>
       
        <li><Button 
        variant="outlined"
        className='btn' onClick={onLoginClick}>
        Login</Button></li>


      </ul>
    </nav>
  );
};

export default Navbar;