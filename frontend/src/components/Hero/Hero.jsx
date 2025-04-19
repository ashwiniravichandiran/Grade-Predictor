import React from 'react';
import './Hero.css';
import grade4Image from '../../assets/grade4.jpg'; // Import the image
import { useNavigate } from "react-router-dom";
import { Button } from '@mui/material';

const Hero = ({ isVisible }) => {
  const navigate = useNavigate();
  
  return (
    <div className='hero container'>
      {/* Background Image */}
      <img className='hero-image' src={grade4Image} alt="Grade 4 Background" />

      {isVisible && (
        <div className='hero-text'>
          <h1>Hi there!</h1>
          <h2>Let's strive for excellence and unlock your full potential!</h2>
          
          <Button 
            variant="outlined" 
            onClick={() => navigate("/signup")}
            sx={{ fontSize: '1.0rem', padding: '10px 22px', borderRadius: '4px'}}
          >
            Sign Up
          </Button>
        </div>
      )}
    </div>
  );
};

export default Hero;
