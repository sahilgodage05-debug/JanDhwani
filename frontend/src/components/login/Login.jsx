import { useState } from 'react';
import './Login.css';

// TODO: Import your Firebase auth instances here once you set up firebase.js
// import { auth, provider } from '../../firebase';
// import { signInWithPopup } from 'firebase/auth';

function Login({ onLoginSuccess, activeLanguage, onLanguageChange }) {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [error, setError] = useState(null);

  const handleGoogleLogin = async () => {
    setIsLoggingIn(true);
    setError(null);
    try {
      /* 
      // ACTUAL FIREBASE CODE (Uncomment when Firebase is configured with API keys):
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      const userData = {
        fullName: user.displayName || 'Citizen',
        email: user.email,
        mobile: user.phoneNumber || 'Not provided',
        state: 'Maharashtra', // Can be fetched from IP/GPS later
        district: 'Pune',
        areaType: 'urban',
        pincode: '411001',
        preferredLanguage: activeLanguage || 'en-IN'
      };
      onLoginSuccess(userData);
      */
      
      // MOCK LOGIN (Temporary until Firebase API keys are added by the user)
      setTimeout(() => {
        const mockUser = {
          fullName: 'Verified Citizen (Google Auth Mock)',
          mobile: '+91 9876543210',
          state: 'Maharashtra',
          district: 'Pune',
          areaType: 'urban',
          pincode: '411001',
          preferredLanguage: activeLanguage || 'en-IN'
        };
        onLoginSuccess(mockUser);
      }, 1000);
      
    } catch (err) {
      console.error('Google Sign-In Error:', err);
      setError('Failed to sign in with Google. Please try again.');
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <div className="login-hero-text">
          <h1>JanDhwani</h1>
          <p className="subtitle">Citizen Grievance Gateway</p>
          <p className="desc">Sign in securely using your Google Account to report civic issues directly to the local authorities.</p>
        </div>
      </div>
      
      <div className="login-right">
        <div className="auth-card" style={{padding: '40px', maxWidth: '400px', margin: '0 auto', textAlign: 'center'}}>
          <h2>Welcome to JanDhwani</h2>
          <p style={{marginBottom: '30px', color: '#5d4037'}}>Secure Authentication Gateway</p>
          
          {error && <div className="error-text" style={{color: 'red', marginBottom: '15px'}}>{error}</div>}
          
          <button 
            type="button" 
            className="primary-auth-btn"
            onClick={handleGoogleLogin}
            disabled={isLoggingIn}
            style={{
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: '10px',
              width: '100%',
              padding: '14px',
              fontSize: '1.1rem',
              background: '#fff',
              color: '#333',
              border: '1px solid #ccc',
              borderRadius: '8px',
              cursor: 'pointer',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" style={{width: '24px'}} />
            {isLoggingIn ? 'Signing in...' : 'Sign in with Google'}
          </button>
          
          <div style={{marginTop: '40px', fontSize: '0.9rem', color: '#777'}}>
            <p>Note: Google Login requires Firebase API keys to be configured in the project.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
