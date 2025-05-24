
import React from 'react';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { getAuth } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import googleLogo from '../assets/google2.png'; // Import your Google logo
import { useNavigate } from 'react-router-dom';

import { app, db } from "../components/firebase/firebase";


const auth = getAuth(app);


const Signinwithgoogle = () => {
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log('User signed in:', user);

      // Store user data in Firestore
      await setDoc(doc(db, "users", user.uid), {
        username: user.displayName,
        email: user.email,
        isVerified: user.emailVerified,
        createdAt: new Date(),
      });

      console.log('User data stored in Firestore!');
      // Optional: Redirect to home page or another page after sign-in
      navigate("/Home"); 

    } catch (error) {
      console.error('Error during Google Sign-In:', error.message);
    }
  };

  return (
    <div>
      <div
        style={{ display: "flex", justifyContent: "center", cursor: "pointer" }}
        onClick={handleGoogleSignIn}>
        <img src={googleLogo} alt="Google sign-in" width="60%" />
      </div>
    </div>
  );
};

export default Signinwithgoogle;