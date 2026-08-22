import { useState } from 'react';
import './Login.css';

function Login({ onLoginSuccess, onContinueAsGuest }) {
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'
  const [loginMethod, setLoginMethod] = useState('password'); // 'password' or 'otp'
  
  // Login form state
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Register form state
  const [regData, setRegData] = useState({
    fullName: '',
    mobile: '',
    email: '',
    state: '',
    password: '',
    confirmPassword: ''
  });

  const [message, setMessage] = useState(null);

  const handleSendOtp = () => {
    if (!identifier) {
      alert('कृपया मोबाइल नंबर या आधार नंबर दर्ज करें (Please enter Mobile or Aadhaar number)');
      return;
    }
    setOtpSent(true);
    setMessage({ type: 'info', text: 'OTP sent to your registered mobile number: 123456 (Prototype)' });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (loginMethod === 'password') {
      if (!identifier || !password) {
        alert('Please fill all required fields');
        return;
      }
    } else {
      if (!identifier || !otp) {
        alert('Please enter identifier and OTP');
        return;
      }
    }

    const citizen = {
      name: identifier.includes('@') ? identifier.split('@')[0] : 'Citizen / नागरिक',
      identifier: identifier,
      isLoggedIn: true
    };

    setMessage({ type: 'success', text: 'लॉगिन सफल! (Login Successful)' });
    setTimeout(() => {
      if (onLoginSuccess) {
        onLoginSuccess(citizen);
      }
    }, 600);
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (regData.password !== regData.confirmPassword) {
      alert('Passwords do not match / पासवर्ड मेल नहीं खाते');
      return;
    }

    const citizen = {
      name: regData.fullName || 'Citizen / नागरिक',
      identifier: regData.mobile || regData.email,
      state: regData.state,
      isLoggedIn: true
    };

    setMessage({ type: 'success', text: 'पंजीकरण सफल! (Registration Successful)' });
    setTimeout(() => {
      if (onLoginSuccess) {
        onLoginSuccess(citizen);
      }
    }, 600);
  };

  return (
    <div className="login-card">
      <div className="login-header">
        <span className="login-badge">जन सेवा केंद्र | Citizen Portal</span>
        <h2 className="login-title">जनध्वनि (JanDhwani)</h2>
        <p className="login-subtitle">
          {authMode === 'login' ? 'नागरिक लॉगिन पोर्टल (Citizen Login)' : 'नया नागरिक पंजीकरण (Citizen Registration)'}
        </p>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="auth-tabs">
        <button 
          type="button" 
          className={`auth-tab ${authMode === 'login' ? 'active' : ''}`}
          onClick={() => { setAuthMode('login'); setMessage(null); }}
        >
          🔐 लॉगिन (Login)
        </button>
        <button 
          type="button" 
          className={`auth-tab ${authMode === 'register' ? 'active' : ''}`}
          onClick={() => { setAuthMode('register'); setMessage(null); }}
        >
          📝 नया खाता (Register)
        </button>
      </div>

      {message && (
        <div className={`auth-alert ${message.type}`}>
          {message.text}
        </div>
      )}

      {authMode === 'login' ? (
        <form onSubmit={handleLogin} className="auth-form">
          <div className="login-method-toggle">
            <label>
              <input 
                type="radio" 
                name="loginMethod" 
                value="password" 
                checked={loginMethod === 'password'}
                onChange={() => setLoginMethod('password')}
              />
              पासवर्ड (Password)
            </label>
            <label>
              <input 
                type="radio" 
                name="loginMethod" 
                value="otp" 
                checked={loginMethod === 'otp'}
                onChange={() => setLoginMethod('otp')}
              />
              ओटीपी (OTP Login)
            </label>
          </div>

          <div className="form-group">
            <label>मोबाइल नंबर / आधार / ईमेल (Mobile/Aadhaar/Email)</label>
            <div className="input-wrapper">
              <span className="input-icon">👤</span>
              <input 
                type="text"
                className="input-field"
                placeholder="उदा. 9876543210 या user@example.com"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
              />
            </div>
          </div>

          {loginMethod === 'password' ? (
            <div className="form-group">
              <label>पासवर्ड (Password)</label>
              <div className="input-wrapper">
                <span className="input-icon">🔒</span>
                <input 
                  type="password"
                  className="input-field"
                  placeholder="अपना पासवर्ड दर्ज करें"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
          ) : (
            <div className="form-group">
              <label>ओटीपी (One-Time Password)</label>
              <div className="otp-row">
                <div className="input-wrapper" style={{ flex: 1 }}>
                  <span className="input-icon">💬</span>
                  <input 
                    type="text"
                    className="input-field"
                    placeholder="6-अंकों का OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength="6"
                    required
                  />
                </div>
                <button 
                  type="button" 
                  className="otp-btn" 
                  onClick={handleSendOtp}
                >
                  {otpSent ? 'पुनः भेजें (Resend)' : 'OTP प्राप्त करें (Send OTP)'}
                </button>
              </div>
            </div>
          )}

          <div className="form-options">
            <label className="remember-me">
              <input 
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              याद रखें (Remember Me)
            </label>
            <button 
              type="button" 
              className="forgot-link"
              onClick={() => alert('पासवर्ड रीसेट लिंक आपके नंबर पर भेजा गया है (Reset link dispatched)')}
            >
              पासवर्ड भूल गए?
            </button>
          </div>

          <button type="submit" className="auth-submit-btn">
            सुरक्षित लॉगिन करें (Sign In)
          </button>

          {onContinueAsGuest && (
            <>
              <div className="guest-divider">
                <span>अथवा (OR)</span>
              </div>
              <button 
                type="button" 
                className="guest-btn"
                onClick={onContinueAsGuest}
              >
                बिना लॉगिन सीधे शिकायत करें (Continue as Guest) ➔
              </button>
            </>
          )}
        </form>
      ) : (
        <form onSubmit={handleRegister} className="auth-form">
          <div className="form-group">
            <label>पूरा नाम (Full Name) *</label>
            <div className="input-wrapper">
              <span className="input-icon">👤</span>
              <input 
                type="text"
                className="input-field"
                placeholder="उदा. राहुल शर्मा"
                value={regData.fullName}
                onChange={(e) => setRegData({ ...regData, fullName: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>मोबाइल नंबर (Mobile) *</label>
              <div className="input-wrapper">
                <span className="input-icon">📱</span>
                <input 
                  type="tel"
                  className="input-field"
                  placeholder="10-digit Mobile"
                  value={regData.mobile}
                  onChange={(e) => setRegData({ ...regData, mobile: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label>राज्य / जिला (State) *</label>
              <div className="input-wrapper">
                <span className="input-icon">📍</span>
                <input 
                  type="text"
                  className="input-field"
                  placeholder="उदा. Maharashtra"
                  value={regData.state}
                  onChange={(e) => setRegData({ ...regData, state: e.target.value })}
                  required
                />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label>ईमेल (Email ID - Optional)</label>
            <div className="input-wrapper">
              <span className="input-icon">✉️</span>
              <input 
                type="email"
                className="input-field"
                placeholder="name@example.com"
                value={regData.email}
                onChange={(e) => setRegData({ ...regData, email: e.target.value })}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>पासवर्ड बनाएं *</label>
              <div className="input-wrapper">
                <span className="input-icon">🔒</span>
                <input 
                  type="password"
                  className="input-field"
                  placeholder="Create Password"
                  value={regData.password}
                  onChange={(e) => setRegData({ ...regData, password: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label>पासवर्ड पुष्टि करें *</label>
              <div className="input-wrapper">
                <span className="input-icon">🔐</span>
                <input 
                  type="password"
                  className="input-field"
                  placeholder="Confirm Password"
                  value={regData.confirmPassword}
                  onChange={(e) => setRegData({ ...regData, confirmPassword: e.target.value })}
                  required
                />
              </div>
            </div>
          </div>

          <button type="submit" className="auth-submit-btn">
            खाता बनाएं (Register & Continue)
          </button>
        </form>
      )}
    </div>
  );
}

export default Login;
