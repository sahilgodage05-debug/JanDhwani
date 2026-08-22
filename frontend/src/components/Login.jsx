import { useState } from 'react';
import './Login.css';

// Pre-configured citizen profiles for hackathon judges & instant demo
const DEMO_CITIZENS = [
  {
    fullName: 'राकेश कुमार (Rakesh Kumar)',
    mobile: '9876543210',
    email: 'rakesh.kumar@bihar.gov.in',
    state: 'Bihar',
    district: 'Purnia',
    areaType: 'Rural (ग्रामीण)',
    pincode: '854301',
    idType: 'Aadhaar (आधार)',
    idNumber: '•••• •••• 4589',
    language: 'hi-IN (हिंदी / Bhojpuri)',
    povertyIndexFactor: 'High (0.84)'
  },
  {
    fullName: 'மீனாட்சி சுந்தரம் (Meenakshi S.)',
    mobile: '9812345678',
    email: 'meenakshi.s@chennai.tn.in',
    state: 'Tamil Nadu',
    district: 'Madurai',
    areaType: 'Urban (शहरी)',
    pincode: '625001',
    idType: 'Voter ID (मतदाता पत्र)',
    idNumber: 'TN/04/12984',
    language: 'ta-IN (தமிழ்)',
    povertyIndexFactor: 'Moderate (0.32)'
  },
  {
    fullName: 'Carlos Silva (BRICS Demo)',
    mobile: '+55 11 98765-4321',
    email: 'carlos.silva@gov.br',
    state: 'São Paulo',
    district: 'Zona Leste',
    areaType: 'Urban Periphery',
    pincode: '01000-000',
    idType: 'CPF / Citizen Registry',
    idNumber: '345.678.901-22',
    language: 'pt-BR (Português)',
    povertyIndexFactor: 'Developing (0.61)'
  }
];

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi (NCT)', 'BRICS - Brazil (São Paulo)', 'BRICS - South Africa (Gauteng)'
];

const LANGUAGES = [
  { code: 'hi-IN', label: 'हिंदी (Hindi / Bhojpuri / Maithili)' },
  { code: 'en-IN', label: 'English (Indian English)' },
  { code: 'ta-IN', label: 'தமிழ் (Tamil)' },
  { code: 'te-IN', label: 'తెలుగు (Telugu)' },
  { code: 'bn-IN', label: 'বাংলা (Bengali)' },
  { code: 'mr-IN', label: 'मराठी (Marathi)' },
  { code: 'gu-IN', label: 'ગુજરાતી (Gujarati)' },
  { code: 'kn-IN', label: 'ಕನ್ನಡ (Kannada)' },
  { code: 'pt-BR', label: 'Português (BRICS - Brazil)' },
  { code: 'ru-RU', label: 'Русский (BRICS - Russia)' },
  { code: 'zh-CN', label: '中文 (BRICS - China)' }
];

function Login({ onLoginSuccess, onContinueAsGuest }) {
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'
  const [loginMethod, setLoginMethod] = useState('otp'); // 'otp' | 'password' | 'digilocker'
  
  // Login form state
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Government Registration state
  const [regData, setRegData] = useState({
    fullName: '',
    gender: 'Male',
    ageGroup: '18-35',
    mobile: '',
    email: '',
    idType: 'Aadhaar',
    idNumber: '',
    state: 'Maharashtra',
    district: '',
    pincode: '',
    areaType: 'Rural (ग्रामीण)',
    preferredLanguage: 'hi-IN',
    password: '',
    confirmPassword: ''
  });

  const [alertInfo, setAlertInfo] = useState(null);

  const handleSendOtp = () => {
    if (!identifier || identifier.trim().length < 4) {
      setAlertInfo({ 
        type: 'error', 
        text: 'कृपया मान्य मोबाइल नंबर या आधार नंबर दर्ज करें (Please enter valid Mobile or Aadhaar)' 
      });
      return;
    }
    setOtpSent(true);
    setAlertInfo({ 
      type: 'info', 
      text: '📲 OTP sent: [9 4 2 1 0 8] (Simulated JanDhwani SMS Gateway)' 
    });
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (loginMethod === 'password') {
      if (!identifier || !password) {
        setAlertInfo({ type: 'error', text: 'Please fill all required fields.' });
        return;
      }
    } else if (loginMethod === 'otp') {
      if (!identifier || !otp) {
        setAlertInfo({ type: 'error', text: 'Please enter registered identifier and OTP.' });
        return;
      }
    }

    const citizen = {
      fullName: identifier.includes('@') ? identifier.split('@')[0] : `Citizen (${identifier.slice(-4)})`,
      mobile: identifier.includes('@') ? '9876543210' : identifier,
      email: identifier.includes('@') ? identifier : '',
      state: 'National Portal',
      district: 'Citizen Jurisdiction',
      areaType: 'Urban (शहरी)',
      pincode: '110001',
      idType: 'Citizen ID',
      idNumber: 'JD-IN-' + Math.floor(100000 + Math.random() * 900000),
      language: 'hi-IN (हिंदी)',
      isLoggedIn: true
    };

    setAlertInfo({ type: 'success', text: '✅ पहचान प्रमाणित! (Citizen Identity Verified). Redirecting...' });
    setTimeout(() => {
      onLoginSuccess(citizen);
    }, 600);
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (regData.password && regData.password !== regData.confirmPassword) {
      setAlertInfo({ type: 'error', text: 'Passwords do not match / पासवर्ड मेल नहीं खाते' });
      return;
    }

    if (!regData.fullName || !regData.mobile || !regData.district) {
      setAlertInfo({ type: 'error', text: 'Please complete all required citizen demographic fields.' });
      return;
    }

    const citizen = {
      fullName: regData.fullName,
      mobile: regData.mobile,
      email: regData.email,
      state: regData.state,
      district: regData.district,
      pincode: regData.pincode,
      areaType: regData.areaType,
      idType: regData.idType,
      idNumber: regData.idNumber ? `•••• •••• ${regData.idNumber.slice(-4)}` : 'Verified',
      language: regData.preferredLanguage,
      isLoggedIn: true
    };

    setAlertInfo({ type: 'success', text: '🎉 नागरिक पंजीकरण सफल! (Citizen Digital ID Created). Redirecting...' });
    setTimeout(() => {
      onLoginSuccess(citizen);
    }, 600);
  };

  const handleDemoSelect = (demoCitizen) => {
    setAlertInfo({ type: 'success', text: `✨ Demo Profile Loaded: ${demoCitizen.fullName} (${demoCitizen.state})` });
    setTimeout(() => {
      onLoginSuccess({ ...demoCitizen, isLoggedIn: true });
    }, 400);
  };

  return (
    <div className="login-card">
      {/* Header Banner */}
      <div className="login-header">
        <div className="emblem-row">
          <span className="national-badge">🇮🇳 Digital India | DPI</span>
          <span className="brics-badge">🌐 BRICS Scalable</span>
        </div>
        <h1 className="login-title">जनध्वनि (JanDhwani)</h1>
        <p className="login-tagline">3D Digital Twin Platform • Citizen Identity Gateway</p>
        <p className="login-desc">
          Unified Digital Public Infrastructure (DPI) for Citizen Voice & National Infrastructure Budgeting
        </p>
      </div>

      {/* Quick Judge / Demo One-Click Access */}
      <div className="demo-box">
        <div className="demo-header">
          <span className="demo-icon">⚡</span>
          <strong>Hackathon / Judge 1-Click Demo Profiles:</strong>
        </div>
        <div className="demo-chips">
          {DEMO_CITIZENS.map((demo, idx) => (
            <button
              key={idx}
              type="button"
              className="demo-chip"
              onClick={() => handleDemoSelect(demo)}
              title="Click to instantly login as this citizen with pre-filled demographics"
            >
              👤 {demo.fullName.split(' ')[0]} ({demo.state} • {demo.areaType.split(' ')[0]})
            </button>
          ))}
        </div>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="auth-tabs">
        <button 
          type="button" 
          className={`auth-tab ${authMode === 'login' ? 'active' : ''}`}
          onClick={() => { setAuthMode('login'); setAlertInfo(null); }}
        >
          🔐 नागरिक लॉगिन (Citizen Login)
        </button>
        <button 
          type="button" 
          className={`auth-tab ${authMode === 'register' ? 'active' : ''}`}
          onClick={() => { setAuthMode('register'); setAlertInfo(null); }}
        >
          📝 नया नागरिक पंजीकरण (New Registration)
        </button>
      </div>

      {alertInfo && (
        <div className={`auth-alert ${alertInfo.type}`}>
          {alertInfo.text}
        </div>
      )}

      {authMode === 'login' ? (
        <form onSubmit={handleLoginSubmit} className="auth-form">
          <div className="method-selector">
            <button
              type="button"
              className={`method-btn ${loginMethod === 'otp' ? 'selected' : ''}`}
              onClick={() => setLoginMethod('otp')}
            >
              📲 OTP Login (ओटीपी)
            </button>
            <button
              type="button"
              className={`method-btn ${loginMethod === 'password' ? 'selected' : ''}`}
              onClick={() => setLoginMethod('password')}
            >
              🔒 Password (पासवर्ड)
            </button>
            <button
              type="button"
              className={`method-btn ${loginMethod === 'digilocker' ? 'selected' : ''}`}
              onClick={() => {
                setLoginMethod('digilocker');
                setAlertInfo({ type: 'info', text: '🔗 DigiLocker / MeriPehchaan Sandbox Enabled for Demo' });
              }}
            >
              🏛️ MeriPehchaan (मेरी पहचान)
            </button>
          </div>

          <div className="form-group">
            <label>
              मोबाइल नंबर / आधार / नागरिक आईडी (Mobile / Aadhaar / Citizen ID) <span className="req">*</span>
            </label>
            <div className="input-wrapper">
              <span className="input-icon">🆔</span>
              <input 
                type="text"
                className="input-field"
                placeholder="उदा. 9876543210 या 12-digit Aadhaar"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
              />
            </div>
            <small className="field-hint">Used to fetch your jurisdiction & demographic index</small>
          </div>

          {loginMethod === 'otp' && (
            <div className="form-group">
              <label>ओटीपी (One-Time Password) <span className="req">*</span></label>
              <div className="otp-row">
                <div className="input-wrapper" style={{ flex: 1 }}>
                  <span className="input-icon">💬</span>
                  <input 
                    type="text"
                    className="input-field"
                    placeholder="6-अंकों का OTP (e.g. 942108)"
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
                  {otpSent ? 'पुनः भेजें (Resend OTP)' : 'OTP प्राप्त करें (Send OTP)'}
                </button>
              </div>
            </div>
          )}

          {loginMethod === 'password' && (
            <div className="form-group">
              <label>सुरक्षित पासवर्ड (Password) <span className="req">*</span></label>
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
          )}

          {loginMethod === 'digilocker' && (
            <div className="digilocker-box">
              <p>Connect securely with Government Single Sign-On (MeriPehchaan / Jan Parichay)</p>
              <button 
                type="button" 
                className="digilocker-action-btn"
                onClick={() => handleDemoSelect(DEMO_CITIZENS[0])}
              >
                🇮🇳 Authenticate with MeriPehchaan ID
              </button>
            </div>
          )}

          <div className="form-options">
            <label className="remember-me">
              <input 
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              याद रखें (Keep Me Signed In)
            </label>
            <button 
              type="button" 
              className="forgot-link"
              onClick={() => alert('पासवर्ड रीसेट लिंक आपके नंबर पर भेजा गया है (Reset link dispatched via SMS)')}
            >
              पासवर्ड भूल गए?
            </button>
          </div>

          <button type="submit" className="auth-submit-btn">
            प्रवेश करें (Verify & Login to JanDhwani) ➔
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
                बिना लॉगिन सीधे शिकायत करें (Proceed as Anonymous Citizen) ➔
              </button>
            </>
          )}
        </form>
      ) : (
        /* Government-Grade Comprehensive Registration Form */
        <form onSubmit={handleRegisterSubmit} className="auth-form registration-form">
          <div className="section-title">
            <span>1. व्यक्तिगत विवरण (Personal & Identity Details)</span>
          </div>

          <div className="form-group">
            <label>नागरिक का पूरा नाम (Full Name as per Aadhaar/Govt ID) <span className="req">*</span></label>
            <div className="input-wrapper">
              <span className="input-icon">👤</span>
              <input 
                type="text"
                className="input-field"
                placeholder="उदा. राहुल शर्मा / Rajesh Patel"
                value={regData.fullName}
                onChange={(e) => setRegData({ ...regData, fullName: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>लिंग (Gender) <span className="req">*</span></label>
              <select 
                className="input-field select-field"
                value={regData.gender}
                onChange={(e) => setRegData({ ...regData, gender: e.target.value })}
              >
                <option value="Male">पुरुष (Male)</option>
                <option value="Female">महिला (Female)</option>
                <option value="Transgender">अन्य (Transgender / Other)</option>
              </select>
            </div>
            <div className="form-group">
              <label>आयु वर्ग (Age Group)</label>
              <select 
                className="input-field select-field"
                value={regData.ageGroup}
                onChange={(e) => setRegData({ ...regData, ageGroup: e.target.value })}
              >
                <option value="18-35">18 - 35 Years (Youth)</option>
                <option value="36-60">36 - 60 Years</option>
                <option value="60+">60+ Years (Senior Citizen)</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>सरकारी पहचान पत्र (ID Type)</label>
              <select 
                className="input-field select-field"
                value={regData.idType}
                onChange={(e) => setRegData({ ...regData, idType: e.target.value })}
              >
                <option value="Aadhaar">Aadhaar Card (आधार कार्ड)</option>
                <option value="Voter ID">Voter ID (मतदाता पत्र)</option>
                <option value="Ration Card">Ration Card (राशन कार्ड)</option>
                <option value="Passport/Govt">Passport / Govt Employee ID</option>
              </select>
            </div>
            <div className="form-group">
              <label>पहचान पत्र संख्या (ID Number)</label>
              <input 
                type="text"
                className="input-field"
                placeholder="अंतिम 4 अंक दर्ज करें (e.g. 4589)"
                value={regData.idNumber}
                onChange={(e) => setRegData({ ...regData, idNumber: e.target.value })}
              />
            </div>
          </div>

          <div className="section-title">
            <span>2. संपर्क एवं भौगोलिक विवरण (Jurisdiction & Demographics)</span>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>मोबाइल नंबर (Mobile Number) <span className="req">*</span></label>
              <div className="input-wrapper">
                <span className="input-icon">📱</span>
                <input 
                  type="tel"
                  className="input-field"
                  placeholder="10-अंकों का मोबाइल"
                  value={regData.mobile}
                  onChange={(e) => setRegData({ ...regData, mobile: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label>ईमेल (Email Address)</label>
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
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>राज्य / केंद्र शासित प्रदेश (State/UT) <span className="req">*</span></label>
              <select 
                className="input-field select-field"
                value={regData.state}
                onChange={(e) => setRegData({ ...regData, state: e.target.value })}
                required
              >
                {INDIAN_STATES.map((st) => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>जिला / तहसील (District) <span className="req">*</span></label>
              <input 
                type="text"
                className="input-field"
                placeholder="उदा. Purnia / Madurai / Pune"
                value={regData.district}
                onChange={(e) => setRegData({ ...regData, district: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>क्षेत्र प्रकार (Area Demographics) <span className="req">*</span></label>
              <select 
                className="input-field select-field"
                value={regData.areaType}
                onChange={(e) => setRegData({ ...regData, areaType: e.target.value })}
              >
                <option value="Rural (ग्रामीण)">Rural (ग्रामीण - Village/Panchayat)</option>
                <option value="Urban (शहरी)">Urban (शहरी - Municipal/Metro)</option>
                <option value="Semi-Urban (कस्बा)">Semi-Urban (कस्बा/Town)</option>
                <option value="Tribal/Aspirational (आकांक्षी)">Tribal / Aspirational District</option>
              </select>
            </div>
            <div className="form-group">
              <label>पिन कोड (Pincode) <span className="req">*</span></label>
              <input 
                type="text"
                className="input-field"
                placeholder="6-अंकों का पिन कोड"
                value={regData.pincode}
                onChange={(e) => setRegData({ ...regData, pincode: e.target.value })}
                maxLength="6"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>प्राथमिक भाषा / बोली (Preferred Grievance Language) <span className="req">*</span></label>
            <select 
              className="input-field select-field"
              value={regData.preferredLanguage}
              onChange={(e) => setRegData({ ...regData, preferredLanguage: e.target.value })}
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>{lang.label}</option>
              ))}
            </select>
            <small className="field-hint">Google AI Studio will auto-translate voice and text from this language</small>
          </div>

          <div className="section-title">
            <span>3. सुरक्षा एवं पासवर्ड (Security)</span>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>पासवर्ड बनाएं (Create Password) <span className="req">*</span></label>
              <input 
                type="password"
                className="input-field"
                placeholder="Minimum 6 characters"
                value={regData.password}
                onChange={(e) => setRegData({ ...regData, password: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>पासवर्ड पुष्टि (Confirm) <span className="req">*</span></label>
              <input 
                type="password"
                className="input-field"
                placeholder="Re-enter password"
                value={regData.confirmPassword}
                onChange={(e) => setRegData({ ...regData, confirmPassword: e.target.value })}
                required
              />
            </div>
          </div>

          <button type="submit" className="auth-submit-btn">
            🇮🇳 जनध्वनि नागरिक पहचान बनाएं (Create Citizen Digital ID) ➔
          </button>
        </form>
      )}
    </div>
  );
}

export default Login;
