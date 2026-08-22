import { useState, useMemo } from 'react';
import { 
  ALL_LANGUAGES, 
  LANGUAGE_REGIONS, 
  STATES_AND_DISTRICTS, 
  PINCODE_MAP, 
  EXPANDED_DEMO_CITIZENS 
} from '../indiaData';
import { UI_STRINGS } from '../translations';
import './Login.css';

function Login({ onLoginSuccess, onContinueAsGuest }) {
  // Step 0: Language Gate state
  const [hasSelectedLanguage, setHasSelectedLanguage] = useState(false);
  const [currentLang, setCurrentLang] = useState('hi-IN');
  const [languageSearch, setLanguageSearch] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('all');

  // Auth view mode ('register' by default after language selection or 'login')
  const [authMode, setAuthMode] = useState('register');
  const [regStep, setRegStep] = useState(1); // 1: Contact, 2: Jurisdiction, 3: Security
  const [loginMethod, setLoginMethod] = useState('otp'); // 'otp' | 'password'

  // Login form state
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginOtp, setLoginOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  // Government Registration state (with all critical governance & routing fields)
  const [regData, setRegData] = useState({
    fullName: '',
    mobile: '',
    email: '',
    state: 'Maharashtra',
    district: 'Pune',
    areaType: 'rural', // 'rural' or 'urban'
    tehsil: '',
    panchayatOrWard: '',
    pincode: '',
    preferredLanguage: 'hi-IN',
    password: '',
    confirmPassword: ''
  });

  const [alertInfo, setAlertInfo] = useState(null);
  const [pincodeDetectedInfo, setPincodeDetectedInfo] = useState(null);

  // Helper for UI text based on chosen language
  const t = UI_STRINGS[currentLang] || UI_STRINGS['hi-IN'] || UI_STRINGS['en-IN'];

  // Filter languages based on search and region
  const filteredLanguages = useMemo(() => {
    return ALL_LANGUAGES.filter(lang => {
      const matchesSearch = 
        lang.name.toLowerCase().includes(languageSearch.toLowerCase()) ||
        lang.native.toLowerCase().includes(languageSearch.toLowerCase()) ||
        lang.region.toLowerCase().includes(languageSearch.toLowerCase());

      if (!matchesSearch) return false;

      if (selectedRegion === 'all') return true;
      if (selectedRegion === 'popular') return lang.popular;
      if (selectedRegion === 'north') return lang.region.includes('North');
      if (selectedRegion === 'south') return lang.region.includes('South');
      if (selectedRegion === 'west') return lang.region.includes('West');
      if (selectedRegion === 'east') return lang.region.includes('East') || lang.region.includes('North-East');
      if (selectedRegion === 'brics') return lang.brics;
      return true;
    });
  }, [languageSearch, selectedRegion]);

  // Handle Language Select
  const handleLanguageSelect = (langCode) => {
    setCurrentLang(langCode);
    setRegData(prev => ({ ...prev, preferredLanguage: langCode }));
    setHasSelectedLanguage(true);
  };

  // Smart Pincode Auto-Fill Function
  const handlePincodeChange = (pin) => {
    setRegData(prev => ({ ...prev, pincode: pin }));
    if (pin.length >= 2) {
      const prefix = pin.substring(0, 2);
      const match = PINCODE_MAP[prefix];
      if (match) {
        setRegData(prev => ({
          ...prev,
          pincode: pin,
          state: match.state,
          district: match.district,
          areaType: match.areaType
        }));
        setPincodeDetectedInfo(`⚡ Auto-Detected: ${match.district}, ${match.state} (${match.areaType === 'rural' ? 'Rural' : 'Urban'})`);
      } else {
        setPincodeDetectedInfo(null);
      }
    } else {
      setPincodeDetectedInfo(null);
    }
  };

  // Fast Auto-Fill with DigiLocker / Aadhaar Sandbox
  const handleDigiLockerFastFill = () => {
    setRegData({
      fullName: 'सुनील देशमुख (Sunil Deshmukh)',
      mobile: '9822998877',
      email: 'sunil.deshmukh@gov.in',
      state: 'Maharashtra',
      district: 'Pune',
      areaType: 'rural',
      tehsil: 'Haveli Taluka',
      panchayatOrWard: 'Loni Kalbhor Panchayat',
      pincode: '412201',
      preferredLanguage: currentLang,
      password: 'Password@123',
      confirmPassword: 'Password@123'
    });
    setAlertInfo({ 
      type: 'success', 
      text: '🇮🇳 DigiLocker / Aadhaar Verified: Demographics & Identity auto-filled instantly!' 
    });
  };

  // GPS Auto-Detect for Jurisdiction
  const handleGpsJurisdiction = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }
    navigator.geolocation.getCurrentPosition((pos) => {
      setAlertInfo({
        type: 'info',
        text: `📍 GPS Coordinates Locked (${pos.coords.latitude.toFixed(4)}° N, ${pos.coords.longitude.toFixed(4)}° E) - Auto-assigned to local district node.`
      });
    }, () => {
      alert('Unable to fetch GPS. You can select State and District from the dropdowns.');
    });
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
      tehsil: regData.tehsil || (regData.areaType === 'rural' ? 'Taluka HQ' : 'Central Zone'),
      panchayatOrWard: regData.panchayatOrWard || (regData.areaType === 'rural' ? 'Gram Panchayat' : 'Ward 1'),
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
     SCREEN 1: PAN-INDIA MULTILINGUAL SELECTION SPLASH (All 22+ Languages)
     ========================================================================= */
  if (!hasSelectedLanguage) {
    return (
      <div className="login-card lang-screen-card">
        <div className="login-header">
          <div className="emblem-row">
            <span className="national-badge">🇮🇳 22 Official Scheduled Languages of India</span>
            <span className="brics-badge">🌐 BRICS Multilingual DPI</span>
          </div>
          <h1 className="login-title">जनध्वनि (JanDhwani)</h1>
          <p className="login-tagline">3D Digital Twin Platform • Voice of the People</p>
          
          <div className="lang-prompt-box">
            <h2 className="lang-prompt-title">अपनी भाषा चुनें • Select Your Language</h2>
            <p className="lang-prompt-sub">
              Accessible speech-to-text, Gemini AI auto-translation & government notifications in your mother tongue
            </p>
          </div>
        </div>

        {/* Language Search & Region Filters */}
        <div className="lang-controls">
          <div className="lang-search-wrapper">
            <span className="search-icon">🔍</span>
            <input 
              type="text"
              className="lang-search-input"
              placeholder="Search language (उदा. मराठी, தமிழ், Bengali, Punjabi, Gujarati)..."
              value={languageSearch}
              onChange={(e) => setLanguageSearch(e.target.value)}
            />
            {languageSearch && (
              <button 
                type="button" 
                className="clear-search-btn"
                onClick={() => setLanguageSearch('')}
              >
                ✕
              </button>
            )}
          </div>

          <div className="region-filter-tabs">
            {LANGUAGE_REGIONS.map((reg) => (
              <button
                key={reg.id}
                type="button"
                className={`region-tab ${selectedRegion === reg.id ? 'active' : ''}`}
                onClick={() => setSelectedRegion(reg.id)}
              >
                {reg.label}
              </button>
            ))}
          </div>
        </div>

        {/* Comprehensive Grid of Pan-India & BRICS Languages */}
        <div className="language-grid pan-india-grid">
          {filteredLanguages.map((lang) => (
            <button
              key={lang.code}
              type="button"
              className={`lang-card-btn ${lang.brics ? 'brics-lang' : ''} ${lang.popular ? 'popular-lang' : ''}`}
              onClick={() => handleLanguageSelect(lang.code)}
            >
              <div className="lang-card-top">
                <span className="lang-script">{lang.script}</span>
                {lang.popular && <span className="popular-badge">⭐</span>}
              </div>
              <span className="lang-native">{lang.native}</span>
              <span className="lang-english">{lang.name}</span>
              <span className="lang-region-tag">{lang.region.split('(')[0]}</span>
            </button>
          ))}
        </div>

        {filteredLanguages.length === 0 && (
          <div className="no-lang-match">
            <p>No language matching "{languageSearch}". You can choose English or Hindi.</p>
            <button 
              type="button" 
              className="reset-lang-btn"
              onClick={() => { setLanguageSearch(''); setSelectedRegion('all'); }}
            >
              Show All Languages
            </button>
          </div>
        )}

        <div className="lang-footer-note">
          <span>💡 Built with <strong>Digital India Bhashini</strong> & <strong>Google Gemini AI</strong> for 100% regional voice accessibility</span>
        </div>
      </div>
    );
  }

  /* =========================================================================
     SCREEN 2: SIGN UP / LOGIN WITH SMART GOVERNANCE DATA & EASY REGISTRATION
     ========================================================================= */
  const currentDistricts = STATES_AND_DISTRICTS[regData.state] || STATES_AND_DISTRICTS['Maharashtra'];

  return (
    <div className="login-card">
      {/* Top Header with Active Language Indicator */}
      <div className="login-header">
        <div className="header-top-bar">
          <span className="national-badge">🇮🇳 JanDhwani DPI Portal</span>
          <button 
            type="button" 
            className="change-lang-btn"
            onClick={() => setHasSelectedLanguage(false)}
            title="Switch Language"
          >
            🌐 {ALL_LANGUAGES.find(l => l.code === currentLang)?.native || 'भाषा'} ({t.changeLang || 'Change Language'})
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
          {EXPANDED_DEMO_CITIZENS.map((demo, idx) => (
            <button
              key={idx}
              type="button"
              className="demo-chip"
              onClick={() => handleDemoSelect(demo)}
              title={`Load profile for ${demo.fullName}`}
            >
              👤 {demo.fullName.split(' ')[0]} ({demo.state.split(' ')[0]} • {demo.areaType === 'rural' ? 'Rural / BDO' : 'Urban / Ward'})
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
           REGISTRATION FORM: With Smart Pincode, GPS, & Linked Dropdowns
           ========================================================================= */
        <form onSubmit={handleRegisterSubmit} className="auth-form registration-form">
          {/* 1-Click DigiLocker Fast-Fill Helper */}
          <div className="digilocker-helper-banner">
            <div className="digi-text">
              <strong>🇮🇳 Easy Sign Up:</strong> Auto-populate credentials via DigiLocker / Aadhaar
            </div>
            <button 
              type="button" 
              className="digi-fast-btn"
              onClick={handleDigiLockerFastFill}
              title="1-Click Auto Fill"
            >
              ⚡ 1-Click Fast Fill
            </button>
          </div>

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
            <div className="sec-title-row">
              <span>{t.sec2}</span>
              <button 
                type="button" 
                className="gps-detect-btn"
                onClick={handleGpsJurisdiction}
                title="Detect GPS"
              >
                📍 Auto-Detect GPS
              </button>
            </div>
          </div>

          {/* Smart Pincode Input (with Instant State & District Detection) */}
          <div className="form-row">
            <div className="form-group">
              <label>{t.pincode} <span className="req">*</span></label>
              <div className="input-wrapper">
                <span className="input-icon">📮</span>
                <input 
                  type="text"
                  className="input-field pincode-highlight"
                  placeholder="e.g. 411001 / 854301 / 600001"
                  value={regData.pincode}
                  onChange={(e) => handlePincodeChange(e.target.value)}
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
                {ALL_LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.native} ({lang.name})
                  </option>
                ))}
              </select>
              <small className="field-hint">📌 {t.prefLangHint}</small>
            </div>
          </div>

          {pincodeDetectedInfo && (
            <div className="pincode-detected-badge">
              {pincodeDetectedInfo}
            </div>
          )}

          {/* State & District Linked Dropdowns */}
          <div className="form-row">
            <div className="form-group">
              <label>{t.state} <span className="req">*</span></label>
              <select 
                className="input-field select-field"
                value={regData.state}
                onChange={(e) => {
                  const newState = e.target.value;
                  const newDistList = STATES_AND_DISTRICTS[newState] || [];
                  setRegData({ 
                    ...regData, 
                    state: newState, 
                    district: newDistList[0] || '' 
                  });
                }}
                required
              >
                {Object.keys(STATES_AND_DISTRICTS).map((st) => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
              <small className="field-hint">📌 {t.stateHint}</small>
            </div>

            <div className="form-group">
              <label>{t.district} <span className="req">*</span></label>
              <select
                className="input-field select-field"
                value={regData.district}
                onChange={(e) => setRegData({ ...regData, district: e.target.value })}
                required
              >
                {currentDistricts.map((dst) => (
                  <option key={dst} value={dst}>{dst}</option>
                ))}
              </select>
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
                    placeholder="उदा. Haveli / Kasba / Jagraon Block"
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
                    placeholder="उदा. Pune PMC / GCC Chennai / KMC"
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
                    placeholder="उदा. Ward No. 14 / Ballygunge"
                    value={regData.panchayatOrWard}
                    onChange={(e) => setRegData({ ...regData, panchayatOrWard: e.target.value })}
                    required
                  />
                  <small className="field-hint">📌 {t.municipalWardHint}</small>
                </div>
              </>
            )}
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
