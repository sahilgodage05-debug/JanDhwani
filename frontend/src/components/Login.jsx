import { useState } from 'react';
import { SUPPORTED_LANGUAGES, UI_STRINGS } from '../translations';
import './Login.css';

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi (NCT)', 'BRICS - Brazil (São Paulo)', 'BRICS - South Africa (Gauteng)'
];

const DEMO_CITIZENS = [
  {
    fullName: 'राकेश कुमार (Rakesh Kumar)',
    mobile: '9876543210',
    email: 'rakesh.kumar@bihar.gov.in',
    state: 'Bihar',
    district: 'Purnia',
    areaType: 'rural',
    tehsil: 'Kasba Block (कस्बा प्रखंड)',
    panchayatOrWard: 'Srinagar Gram Panchayat (श्रीनगर पंचायत)',
    pincode: '854301',
    language: 'hi-IN',
    officialRouting: 'BDO Kasba & DM Purnia',
    povertyIndexFactor: 'High (0.84 - Rural Priority Boost)'
  },
  {
    fullName: 'सचिन पाटील (Sachin Patil)',
    mobile: '9822012345',
    email: 'sachin.patil@pune.gov.in',
    state: 'Maharashtra',
    district: 'Pune',
    areaType: 'rural',
    tehsil: 'Haveli Taluka (हवेली तालुका)',
    panchayatOrWard: 'Wagholi Gram Panchayat (वाघोली)',
    pincode: '412207',
    language: 'mr-IN',
    officialRouting: 'BDO Haveli & Collector Pune',
    povertyIndexFactor: 'Developing (0.52)'
  },
  {
    fullName: 'Meenakshi Sundaram',
    mobile: '9840198765',
    email: 'meenakshi.s@chennaicorp.gov.in',
    state: 'Tamil Nadu',
    district: 'Chennai',
    areaType: 'urban',
    tehsil: 'Mylapore Zone',
    panchayatOrWard: 'Ward No. 124 (Alwarpet)',
    pincode: '600004',
    language: 'ta-IN',
    officialRouting: 'Zonal Officer & Commissioner GCC',
    povertyIndexFactor: 'Urban Baseline (0.28)'
  },
  {
    fullName: 'Carlos Silva (BRICS Demo)',
    mobile: '+55 11 98765-4321',
    email: 'carlos.silva@gov.br',
    state: 'BRICS - Brazil (São Paulo)',
    district: 'Zona Leste',
    areaType: 'urban',
    tehsil: 'Itaquera Subprefeitura',
    panchayatOrWard: 'Distrito José Bonifácio',
    pincode: '08210-000',
    language: 'pt-BR',
    officialRouting: 'Subprefeito Itaquera & Prefeito SP',
    povertyIndexFactor: 'Developing (0.64)'
  }
];

function Login({ onLoginSuccess, onContinueAsGuest }) {
  // Step 1: Language Selection Gate (true by default until user picks a language)
  const [hasSelectedLanguage, setHasSelectedLanguage] = useState(false);
  const [currentLang, setCurrentLang] = useState('hi-IN');
  
  // Auth view mode ('register' by default after language selection or 'login')
  const [authMode, setAuthMode] = useState('register');
  const [loginMethod, setLoginMethod] = useState('otp'); // 'otp' | 'password'

  // Login form state
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginOtp, setLoginOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  // Government Registration state (with all critical governance & routing fields)
  const [regData, setRegData] = useState({
    // Identity & Contact
    fullName: '',
    mobile: '',
    email: '',
    // Administrative Geography
    state: 'Maharashtra',
    district: '',
    areaType: 'rural', // 'rural' or 'urban'
    tehsil: '', // Tehsil / Taluka / Block (BDO Routing)
    panchayatOrWard: '', // Gram Panchayat or Municipal Ward
    pincode: '',
    // Personalization
    preferredLanguage: 'hi-IN',
    password: '',
    confirmPassword: ''
  });

  const [alertInfo, setAlertInfo] = useState(null);

  // Helper for UI text based on chosen language
  const t = UI_STRINGS[currentLang] || UI_STRINGS['hi-IN'] || UI_STRINGS['en-IN'];

  const handleLanguageSelect = (langCode) => {
    setCurrentLang(langCode);
    setRegData(prev => ({ ...prev, preferredLanguage: langCode }));
    setHasSelectedLanguage(true);
  };

  const handleSendOtp = () => {
    if (!loginIdentifier || loginIdentifier.trim().length < 4) {
      setAlertInfo({ 
        type: 'error', 
        text: 'कृपया वैध मोबाइल नंबर दर्ज करें (Please enter valid Mobile Number)' 
      });
      return;
    }
    setOtpSent(true);
    setAlertInfo({ 
      type: 'info', 
      text: '📲 OTP sent: [9 4 2 1 0 8] (Simulated JanDhwani DPI SMS Gateway)' 
    });
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (loginMethod === 'password' && (!loginIdentifier || !loginPassword)) {
      setAlertInfo({ type: 'error', text: 'Please fill all required login credentials.' });
      return;
    }
    if (loginMethod === 'otp' && (!loginIdentifier || !loginOtp)) {
      setAlertInfo({ type: 'error', text: 'Please enter Mobile and OTP.' });
      return;
    }

    const citizen = {
      fullName: loginIdentifier.includes('@') ? loginIdentifier.split('@')[0] : `Citizen (${loginIdentifier.slice(-4)})`,
      mobile: loginIdentifier,
      email: loginIdentifier.includes('@') ? loginIdentifier : '',
      state: 'Maharashtra',
      district: 'Pune',
      areaType: 'rural',
      tehsil: 'Haveli Taluka',
      panchayatOrWard: 'Wagholi Panchayat',
      pincode: '412207',
      language: currentLang,
      officialRouting: 'BDO Haveli & Collector Pune',
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

    if (!regData.fullName || !regData.mobile || !regData.state || !regData.district || !regData.pincode) {
      setAlertInfo({ type: 'error', text: 'Please complete all required administrative and contact fields.' });
      return;
    }

    const officialRouting = regData.areaType === 'rural'
      ? `BDO (${regData.tehsil || 'Block'}) & DM (${regData.district})`
      : `Ward Officer (${regData.panchayatOrWard || 'Ward'}) & Municipal Commissioner (${regData.district})`;

    const citizen = {
      fullName: regData.fullName,
      mobile: regData.mobile,
      email: regData.email,
      state: regData.state,
      district: regData.district,
      areaType: regData.areaType,
      tehsil: regData.tehsil,
      panchayatOrWard: regData.panchayatOrWard,
      pincode: regData.pincode,
      language: regData.preferredLanguage || currentLang,
      officialRouting: officialRouting,
      isLoggedIn: true
    };

    setAlertInfo({ type: 'success', text: '🎉 नागरिक खाता सफलतापूर्वक बनाया गया! (Account Created & Verified).' });
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

  /* =========================================================================
     SCREEN 1: LANGUAGE SELECTION FIRST (Mandatory Entry Gate)
     ========================================================================= */
  if (!hasSelectedLanguage) {
    return (
      <div className="login-card lang-screen-card">
        <div className="login-header">
          <div className="emblem-row">
            <span className="national-badge">🇮🇳 Digital Public Infrastructure (DPI)</span>
            <span className="brics-badge">🌐 Bhashini & Google AI</span>
          </div>
          <h1 className="login-title">जनध्वनि (JanDhwani)</h1>
          <p className="login-tagline">3D Digital Twin Platform • Voice of the People</p>
          <div className="lang-prompt-box">
            <h2 className="lang-prompt-title">अपनी भाषा चुनें • Select Your Language</h2>
            <p className="lang-prompt-sub">
              Choose your native language for Voice Recording, Gemini AI Auto-Translation & Official Responses
            </p>
          </div>
        </div>

        {/* Grid of Languages */}
        <div className="language-grid">
          {SUPPORTED_LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              type="button"
              className={`lang-card-btn ${lang.brics ? 'brics-lang' : ''}`}
              onClick={() => handleLanguageSelect(lang.code)}
            >
              <span className="lang-script">{lang.script}</span>
              <span className="lang-native">{lang.native}</span>
              <span className="lang-english">{lang.name} {lang.brics ? '(BRICS)' : ''}</span>
            </button>
          ))}
        </div>

        <div className="lang-footer-note">
          <span>💡 You can switch your preferred language at any time in the portal</span>
        </div>
      </div>
    );
  }

  /* =========================================================================
     SCREEN 2: SIGN UP / LOGIN WITH FULL ESSENTIAL GOVERNANCE FIELDS
     ========================================================================= */
  return (
    <div className="login-card">
      {/* Top Header with Active Language Indicator */}
      <div className="login-header">
        <div className="header-top-bar">
          <span className="national-badge">🇮🇳 JanDhwani DPI</span>
          <button 
            type="button" 
            className="change-lang-btn"
            onClick={() => setHasSelectedLanguage(false)}
            title="Switch Language"
          >
            🌐 {SUPPORTED_LANGUAGES.find(l => l.code === currentLang)?.native || 'भाषा'} ({t.changeLang || 'Change Language'})
          </button>
        </div>

        <h1 className="login-title">{t.portalTitle}</h1>
        <p className="login-tagline">{t.portalSub}</p>
      </div>

      {/* 1-Click Judge & Hackathon Demo Profiles */}
      <div className="demo-box">
        <div className="demo-header">
          <span className="demo-icon">⚡</span>
          <strong>{t.demoTitle}</strong>
        </div>
        <div className="demo-chips">
          {DEMO_CITIZENS.map((demo, idx) => (
            <button
              key={idx}
              type="button"
              className="demo-chip"
              onClick={() => handleDemoSelect(demo)}
              title={`Load profile for ${demo.fullName}`}
            >
              👤 {demo.fullName.split(' ')[0]} ({demo.state} • {demo.areaType === 'rural' ? 'Rural / BDO' : 'Urban / Ward'})
            </button>
          ))}
        </div>
      </div>

      {/* Tabs switcher: Sign Up vs Login */}
      <div className="auth-tabs">
        <button 
          type="button" 
          className={`auth-tab ${authMode === 'register' ? 'active' : ''}`}
          onClick={() => { setAuthMode('register'); setAlertInfo(null); }}
        >
          {t.registerTab}
        </button>
        <button 
          type="button" 
          className={`auth-tab ${authMode === 'login' ? 'active' : ''}`}
          onClick={() => { setAuthMode('login'); setAlertInfo(null); }}
        >
          {t.loginTab}
        </button>
      </div>

      {alertInfo && (
        <div className={`auth-alert ${alertInfo.type}`}>
          {alertInfo.text}
        </div>
      )}

      {authMode === 'register' ? (
        /* =========================================================================
           REGISTRATION FORM: All Essential Fields for Governance & 3D Twin Routing
           ========================================================================= */
        <form onSubmit={handleRegisterSubmit} className="auth-form registration-form">
          {/* Section 1: Identity & Contact */}
          <div className="section-title">
            <span>{t.sec1}</span>
          </div>

          <div className="form-group">
            <label>{t.fullName} <span className="req">*</span></label>
            <div className="input-wrapper">
              <span className="input-icon">👤</span>
              <input 
                type="text"
                className="input-field"
                placeholder={t.fullNamePlaceholder}
                value={regData.fullName}
                onChange={(e) => setRegData({ ...regData, fullName: e.target.value })}
                required
              />
            </div>
            <small className="field-hint">📌 {t.fullNameHint}</small>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>{t.mobile} <span className="req">*</span></label>
              <div className="input-wrapper">
                <span className="input-icon">📱</span>
                <input 
                  type="tel"
                  className="input-field"
                  placeholder="10-Digit Mobile"
                  value={regData.mobile}
                  onChange={(e) => setRegData({ ...regData, mobile: e.target.value })}
                  required
                />
              </div>
              <small className="field-hint">📌 {t.mobileHint}</small>
            </div>

            <div className="form-group">
              <label>{t.email}</label>
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
              <small className="field-hint">📌 {t.emailHint}</small>
            </div>
          </div>

          {/* Section 2: Administrative Geography & Governance Routing */}
          <div className="section-title">
            <span>{t.sec2}</span>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>{t.state} <span className="req">*</span></label>
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
              <small className="field-hint">📌 {t.stateHint}</small>
            </div>

            <div className="form-group">
              <label>{t.district} <span className="req">*</span></label>
              <input 
                type="text"
                className="input-field"
                placeholder="उदा. Purnia / Pune / Chennai"
                value={regData.district}
                onChange={(e) => setRegData({ ...regData, district: e.target.value })}
                required
              />
              <small className="field-hint">📌 {t.districtHint}</small>
            </div>
          </div>

          {/* Area Type Toggle: Rural vs Urban */}
          <div className="form-group">
            <label>{t.areaType} <span className="req">*</span></label>
            <div className="area-type-toggle">
              <button
                type="button"
                className={`area-btn ${regData.areaType === 'rural' ? 'active' : ''}`}
                onClick={() => setRegData({ ...regData, areaType: 'rural' })}
              >
                🌾 {t.rural}
              </button>
              <button
                type="button"
                className={`area-btn ${regData.areaType === 'urban' ? 'active' : ''}`}
                onClick={() => setRegData({ ...regData, areaType: 'urban' })}
              >
                🏙️ {t.urban}
              </button>
            </div>
          </div>

          {/* Dynamic Hierarchy based on Rural vs Urban */}
          <div className="form-row">
            {regData.areaType === 'rural' ? (
              <>
                <div className="form-group">
                  <label>{t.tehsil} <span className="req">*</span></label>
                  <input 
                    type="text"
                    className="input-field"
                    placeholder="उदा. Haveli / Kasba Block"
                    value={regData.tehsil}
                    onChange={(e) => setRegData({ ...regData, tehsil: e.target.value })}
                    required
                  />
                  <small className="field-hint">📌 {t.tehsilHint}</small>
                </div>
                <div className="form-group">
                  <label>{t.panchayat} <span className="req">*</span></label>
                  <input 
                    type="text"
                    className="input-field"
                    placeholder="उदा. Wagholi / Srinagar Panchayat"
                    value={regData.panchayatOrWard}
                    onChange={(e) => setRegData({ ...regData, panchayatOrWard: e.target.value })}
                    required
                  />
                  <small className="field-hint">📌 {t.panchayatHint}</small>
                </div>
              </>
            ) : (
              <>
                <div className="form-group">
                  <label>नगर निगम / जोन (Municipal Corporation / Zone) <span className="req">*</span></label>
                  <input 
                    type="text"
                    className="input-field"
                    placeholder="उदा. Pune PMC / GCC Chennai"
                    value={regData.tehsil}
                    onChange={(e) => setRegData({ ...regData, tehsil: e.target.value })}
                    required
                  />
                  <small className="field-hint">📌 नगर निगम जोनल कार्यालय</small>
                </div>
                <div className="form-group">
                  <label>{t.municipalWard} <span className="req">*</span></label>
                  <input 
                    type="text"
                    className="input-field"
                    placeholder="उदा. Ward No. 14 / Alwarpet"
                    value={regData.panchayatOrWard}
                    onChange={(e) => setRegData({ ...regData, panchayatOrWard: e.target.value })}
                    required
                  />
                  <small className="field-hint">📌 {t.municipalWardHint}</small>
                </div>
              </>
            )}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>{t.pincode} <span className="req">*</span></label>
              <div className="input-wrapper">
                <span className="input-icon">📮</span>
                <input 
                  type="text"
                  className="input-field"
                  placeholder="6-Digit Pincode (e.g. 412207)"
                  value={regData.pincode}
                  onChange={(e) => setRegData({ ...regData, pincode: e.target.value })}
                  maxLength="8"
                  required
                />
              </div>
              <small className="field-hint">📌 {t.pincodeHint}</small>
            </div>

            <div className="form-group">
              <label>{t.prefLang} <span className="req">*</span></label>
              <select 
                className="input-field select-field"
                value={regData.preferredLanguage}
                onChange={(e) => {
                  setRegData({ ...regData, preferredLanguage: e.target.value });
                  setCurrentLang(e.target.value);
                }}
              >
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.native} ({lang.name})
                  </option>
                ))}
              </select>
              <small className="field-hint">📌 {t.prefLangHint}</small>
            </div>
          </div>

          {/* Section 3: Security */}
          <div className="section-title">
            <span>{t.sec3}</span>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>{t.createPass} <span className="req">*</span></label>
              <input 
                type="password"
                className="input-field"
                placeholder="Create Password"
                value={regData.password}
                onChange={(e) => setRegData({ ...regData, password: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>{t.confirmPass} <span className="req">*</span></label>
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

          <button type="submit" className="auth-submit-btn">
            {t.submitSignUp}
          </button>
        </form>
      ) : (
        /* =========================================================================
           LOGIN FORM: Mobile / OTP / Password
           ========================================================================= */
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
          </div>

          <div className="form-group">
            <label>मोबाइल नंबर / ईमेल (Mobile Number / Email) <span className="req">*</span></label>
            <div className="input-wrapper">
              <span className="input-icon">🆔</span>
              <input 
                type="text"
                className="input-field"
                placeholder="उदा. 9822012345"
                value={loginIdentifier}
                onChange={(e) => setLoginIdentifier(e.target.value)}
                required
              />
            </div>
          </div>

          {loginMethod === 'otp' ? (
            <div className="form-group">
              <label>ओटीपी (One-Time Password) <span className="req">*</span></label>
              <div className="otp-row">
                <div className="input-wrapper" style={{ flex: 1 }}>
                  <span className="input-icon">💬</span>
                  <input 
                    type="text"
                    className="input-field"
                    placeholder="6-अंकों का OTP (e.g. 942108)"
                    value={loginOtp}
                    onChange={(e) => setLoginOtp(e.target.value)}
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
          ) : (
            <div className="form-group">
              <label>पासवर्ड (Password) <span className="req">*</span></label>
              <div className="input-wrapper">
                <span className="input-icon">🔒</span>
                <input 
                  type="password"
                  className="input-field"
                  placeholder="अपना पासवर्ड दर्ज करें"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                />
              </div>
            </div>
          )}

          <button type="submit" className="auth-submit-btn">
            {t.loginSubmit}
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
                बिना लॉगिन सीधे शिकायत करें (Proceed as Guest) ➔
              </button>
            </>
          )}
        </form>
      )}
    </div>
  );
}

export default Login;
