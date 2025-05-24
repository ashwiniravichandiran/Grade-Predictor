import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Signup.css';

// Import your components with relative paths, not absolute paths
import Signinwithgoogle from '../../Signinwithgoogle';
import { auth, db } from '../../firebase/firebase';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { FaUser, FaLock, FaEnvelope } from "react-icons/fa";

// Import your assets
import backgroundImage from '../../../assets/grade4.jpg'; // Make sure this file exists

const Signup = ({ onClose }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleClose = (e) => {
    // Prevent any default behavior
    if (e) e.preventDefault();
    
    console.log("Closing signup form");
    
    // If onClose prop exists, call it
    if (typeof onClose === 'function') {
      onClose();
    }
    
    // Always navigate to home page when the X is clicked
    navigate('/');
  };

  const validate = () => {
    const errors = {};
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!username.trim()) {
      errors.username = 'Username is required';
    }

    if (!email) {
      errors.email = 'Email is required';
    } else if (!emailPattern.test(email)) {
      errors.email = 'Invalid email address';
    }

    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters long';
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    
    if (Object.keys(validationErrors).length === 0) {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        console.log('User signed up:', user);

        await sendEmailVerification(user);
        alert('Verification email sent. Please check your inbox.');

        await setDoc(doc(db, "users", user.uid), {
          username: username,
          email: email,
          isVerified: user.emailVerified,
          createdAt: new Date(),
        });

        // Redirect to home page after successful signup
        navigate('/home');
      } catch (error) {
        console.error('Error during sign-up:', error.message);
        setErrors({ firebase: error.message });
      }
    } else {
      setErrors(validationErrors);
    }
  };

  return (
    <div className="signup-container" style={{
      backgroundImage: `url(${backgroundImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }}>
      <div className="form-container">
        <h2>Signup</h2>
        <form onSubmit={handleSubmit} className="signup-text">
          <div className="signup-input">
            <button 
              type="button"
              className="close-button" 
              onClick={handleClose}
            >
              X
            </button>
            <h3>Username:</h3>
            <div className="input-wrapper">
              <FaUser className="input-icon" />
              <input 
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            {errors.username && <p className="error">{errors.username}</p>}
          </div>

          <div className="signup-input">
            <h3>Password:</h3>
            <div className="input-wrapper">
              <FaLock className="input-icon" />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {errors.password && <p className="error">{errors.password}</p>}
          </div>

          <div className="signup-input">
            <h3>Email:</h3>
            <div className="input-wrapper">
              <FaEnvelope className="input-icon" />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            {errors.email && <p className="error">{errors.email}</p>}
          </div>

          <button type="submit" className="signup-submit">
            Sign Up
          </button>
          {errors.firebase && <p className="error">{errors.firebase}</p>}
          
          <p className="centered-text">or</p>

          <Signinwithgoogle />
          
        </form>
      </div>
    </div>
  );
};

export default Signup;