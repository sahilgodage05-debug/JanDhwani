import { useState, useRef } from 'react';
import Login from './components/Login';
import { ALL_LANGUAGES, STATES_AND_DISTRICTS } from './indiaData';
import { UI_STRINGS } from './translations';
import './App.css';

function App() {
  const [selectedLanguage, setSelectedLanguage] = useState('hi-IN');
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState('login'); // 'login' | 'grievance'
  
  // Grievance form state
  const [text, setText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [fileName, setFileName] = useState('');
  const [submissionResult, setSubmissionResult] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Location Confirmation State
  const [locationSource, setLocationSource] = useState('registered'); // 'registered' | 'gps' | 'custom'
  const [gpsCoords, setGpsCoords] = useState(null);
  const [customLocation, setCustomLocation] = useState({
    state: 'Maharashtra',
    district: 'Pune',
    landmark: ''
  });
  const [isLocationConfirmed, setIsLocationConfirmed] = useState(true);
  const [textError, setTextError] = useState(null);
  
  const recognitionRef = useRef(null);

  // Active translation dictionary
  const t = UI_STRINGS[selectedLanguage] || UI_STRINGS['hi-IN'] || UI_STRINGS['en-IN'];

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    if (user.language) {
      setSelectedLanguage(user.language);
    }
    if (user.state) {
      setCustomLocation(prev => ({
        ...prev,
        state: user.state,
        district: user.district || 'Pune'
      }));
    }
    setActiveTab('grievance');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveTab('login');
    setSubmissionResult(null);
  };

  const startRecording = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("Your browser doesn't support Web Speech recognition. Please type your grievance.");
      return;
    }
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = false;
    recognitionRef.current.lang = selectedLanguage;
    recognitionRef.current.interimResults = false;

    recognitionRef.current.onstart = () => {
      setIsRecording(true);
    };

    recognitionRef.current.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setText(prevText => (prevText ? prevText + ' ' + transcript : transcript));
      setTextError(null);
      setIsRecording(false);
    };

    recognitionRef.current.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsRecording(false);
    };

    recognitionRef.current.onend = () => {
      setIsRecording(false);
    };

    recognitionRef.current.start();
  };

  const fetchLiveGps = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }
    navigator.geolocation.getCurrentPosition((position) => {
      setGpsCoords({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        accuracy: Math.round(position.coords.accuracy)
      });
      setLocationSource('gps');
      setIsLocationConfirmed(true);
    }, () => {
      alert("Unable to fetch live GPS. You can confirm via registered jurisdiction or select manually.");
    });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name);
    }
  };

  // Get current active location text summary
  const getActiveLocationSummary = () => {
    if (locationSource === 'registered' && currentUser) {
      return {
        title: `${currentUser.panchayatOrWard || 'Jurisdiction'}, ${currentUser.tehsil || ''}, ${currentUser.district}, ${currentUser.state}`,
        tag: currentUser.areaType === 'rural' ? t.rural : t.urban,
        routing: currentUser.officialRouting || 'BDO / DM Jurisdiction',
        coords: 'Calculated via National GeoJSON (Pin: ' + (currentUser.pincode || '412207') + ')'
      };
    }
    if (locationSource === 'gps' && gpsCoords) {
      return {
        title: `Live GPS Fix (${gpsCoords.lat.toFixed(4)}° N, ${gpsCoords.lng.toFixed(4)}° E)`,
        tag: `Precision: ±${gpsCoords.accuracy}m`,
        routing: `Auto-Mapped to Local Node (${currentUser?.district || 'District'})`,
        coords: `Lat: ${gpsCoords.lat.toFixed(4)}, Lng: ${gpsCoords.lng.toFixed(4)}`
      };
    }
    return {
      title: `${customLocation.landmark ? customLocation.landmark + ', ' : ''}${customLocation.district}, ${customLocation.state}`,
      tag: 'Custom Spot',
      routing: `District Magistrate (${customLocation.district}) & Zonal Engineer`,
      coords: 'Geo-coded from District Node'
    };
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!text || text.trim().length < 5) {
      setTextError(`${t.requiredErr} *`);
      return;
    }

    if (!isLocationConfirmed) {
      alert('कृपया शिकायत का स्थान सत्यापित एवं पुष्ट करें (Please verify and confirm the incident location)');
      return;
    }

    setIsSubmitting(true);
    const locInfo = getActiveLocationSummary();

    // Simulate Step 2 (Google Gemini AI) & Step 3 (Firebase 3D Twin Sync)
    setTimeout(() => {
      setIsSubmitting(false);
      const isRural = currentUser?.areaType === 'rural' || locationSource === 'registered';
      setSubmissionResult({
        ticketId: 'JD-' + Math.floor(100000 + Math.random() * 900000),
        translatedText: text.includes('water') || text.includes('पानी') || text.includes('पाणी') || text.includes('தண்ணீர்')
          ? "Critical public water pipeline rupture & severe water supply deficit reported in verified jurisdiction." 
          : "Essential public infrastructure defect requiring administrative dispatch.",
        department: text.includes('water') || text.includes('पानी') || text.includes('पाणी') || text.includes('தண்ணீர்')
          ? "Ministry of Jal Shakti (जल शक्ति) / Water Supply Board" 
          : "Public Works Department (PWD / लोक निर्माण विभाग)",
        confirmedLocation: locInfo.title,
        routingUnit: locInfo.routing,
        severityScore: isRural ? '8.9/10 (High Priority - Rural Boost)' : '7.5/10 (Standard Severity)',
        syncedTo3DMap: true
      });
    }, 1200);
  };

  const activeLoc = getActiveLocationSummary();
  const availableDistricts = STATES_AND_DISTRICTS[customLocation.state] || STATES_AND_DISTRICTS['Maharashtra'];

  return (
    <div className="container">
      {/* Top Portal Navigation */}
      <nav className="portal-nav">
        <div className="nav-buttons">
          <button 
            type="button"
            className={`nav-btn ${activeTab === 'login' ? 'active' : ''}`}
            onClick={() => setActiveTab('login')}
          >
            {currentUser ? '👤 ' + (t.fullName || 'Citizen') : '🌐 ' + t.portalTitle}
          </button>
          <button 
            type="button"
            className={`nav-btn ${activeTab === 'grievance' ? 'active' : ''}`}
            onClick={() => setActiveTab('grievance')}
          >
            ✍️ {t.fileGrievanceTitle}
          </button>
        </div>

        {currentUser ? (
          <div className="user-status-pill">
            <span>👤 {currentUser.fullName?.split(' ')[0]}</span>
            <button 
              type="button" 
              className="logout-link-btn" 
              onClick={handleLogout}
              title={t.logoutText}
            >
              ({t.logoutText})
            </button>
          </div>
        ) : (
          <span className="guest-badge">Anonymous Mode</span>
        )}
      </nav>

      {/* Main Content Area */}
      {activeTab === 'login' ? (
        <Login 
          activeLanguage={selectedLanguage}
          onLanguageChange={(newLang) => setSelectedLanguage(newLang)}
          onLoginSuccess={handleLoginSuccess}
          onContinueAsGuest={() => setActiveTab('grievance')}
        />
      ) : (
        <div className="card">
          <div className="card-header">
            <h1 className="title">{t.portalTitle}</h1>
            <p className="subtitle">{t.fileGrievanceTitle} • {t.fileGrievanceSub}</p>
          </div>

          {/* Citizen Attached Demographics Banner */}
          {currentUser && (
            <div className="attached-profile-banner">
              <div className="banner-title">
                <span>🛡️ {t.verifiedBadge}</span>
              </div>
              <div className="banner-grid">
                <div><strong>{t.fullName}:</strong> {currentUser.fullName}</div>
                <div><strong>{t.mobile}:</strong> {currentUser.mobile}</div>
                <div><strong>{t.state}:</strong> {currentUser.state}</div>
                <div><strong>{t.district}:</strong> {currentUser.district}</div>
                <div><strong>{t.areaType}:</strong> <span className="highlight-tag">{currentUser.areaType === 'rural' ? t.rural : t.urban}</span></div>
                <div><strong>{t.pincode}:</strong> 📮 {currentUser.pincode}</div>
              </div>
            </div>
          )}

          {submissionResult ? (
            <div className="success-screen">
              <div className="success-icon">🚀</div>
              <h2>{t.dispatchedTitle}</h2>
              <p className="ticket-number">{t.ticketIdText} <strong>{submissionResult.ticketId}</strong></p>
              
              <div className="ai-summary-card">
                <h3>{t.aiTitle}</h3>
                <p><strong>Department:</strong> {submissionResult.department}</p>
                <p><strong>Location:</strong> {submissionResult.confirmedLocation}</p>
                <p><strong>Routing Unit:</strong> {submissionResult.routingUnit}</p>
                <p><strong>Auto-Translation (English):</strong> {submissionResult.translatedText}</p>
                <p><strong>Urgency Score (1-10):</strong> <span className="score-badge">{submissionResult.severityScore}</span></p>
              </div>

              <div className="firebase-status">
                <span>{t.syncedBanner}</span>
              </div>

              <button 
                type="button" 
                className="submit-btn" 
                onClick={() => {
                  setSubmissionResult(null);
                  setText('');
                  setFileName('');
                }}
              >
                {t.fileAnotherBtn}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="form" noValidate>
              {/* Language Selector */}
              <div className="form-group">
                <label>{t.prefLang} <span className="req">*</span></label>
                <select 
                  className="input-field select-field"
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                >
                  {ALL_LANGUAGES.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.native} ({lang.name})
                    </option>
                  ))}
                </select>
              </div>

              {/* Grievance Text Area with HTML5 Speech-to-Text */}
              <div className="form-group">
                <label>{t.yourGrievance} <span className="req">*</span></label>
                <div className="textarea-container">
                  <textarea 
                    rows="5" 
                    placeholder={t.grievancePlaceholder}
                    value={text}
                    onChange={(e) => {
                      setText(e.target.value);
                      if (textError) setTextError(null);
                    }}
                    required
                  />
                  <button 
                    type="button" 
                    className={`mic-button ${isRecording ? 'recording' : ''}`}
                    onClick={startRecording}
                    title={t.recordVoice}
                  >
                    {isRecording ? t.listening : t.recordVoice}
                  </button>
                </div>
                {textError && (
                  <span className="error-text">⚠️ {textError}</span>
                )}
              </div>

              {/* Evidence Upload */}
              <div className="action-buttons">
                <label className="action-btn file-upload">
                  📸 {fileName ? fileName.substring(0, 18) + '...' : t.uploadEvidence}
                  <input type="file" accept="image/*" onChange={handleFileChange} style={{display: 'none'}} />
                </label>
              </div>

              {/* Location Confirmation Section */}
              <div className="location-confirm-section">
                <div className="loc-section-header">
                  <span className="loc-title">📍 {t.locConfirmTitle}</span>
                  <span className="loc-sub">{t.locConfirmSub}</span>
                </div>

                {/* Location Source Selector Tabs */}
                <div className="loc-source-tabs">
                  <button
                    type="button"
                    className={`loc-tab ${locationSource === 'registered' ? 'active' : ''}`}
                    onClick={() => { setLocationSource('registered'); setIsLocationConfirmed(true); }}
                  >
                    {t.profileAddressTab}
                  </button>
                  <button
                    type="button"
                    className={`loc-tab ${locationSource === 'gps' ? 'active' : ''}`}
                    onClick={fetchLiveGps}
                  >
                    {t.liveGpsTab}
                  </button>
                  <button
                    type="button"
                    className={`loc-tab ${locationSource === 'custom' ? 'active' : ''}`}
                    onClick={() => { setLocationSource('custom'); setIsLocationConfirmed(true); }}
                  >
                    {t.customSpotTab}
                  </button>
                </div>

                {/* Custom Location Fields */}
                {locationSource === 'custom' && (
                  <div className="custom-loc-fields">
                    <div className="form-row">
                      <div className="form-group">
                        <label>{t.state} <span className="req">*</span></label>
                        <select
                          className="input-field select-field"
                          value={customLocation.state}
                          onChange={(e) => {
                            const st = e.target.value;
                            const distList = STATES_AND_DISTRICTS[st] || [];
                            setCustomLocation({
                              ...customLocation,
                              state: st,
                              district: distList[0] || ''
                            });
                          }}
                        >
                          {Object.keys(STATES_AND_DISTRICTS).map((st) => (
                            <option key={st} value={st}>{st}</option>
                          ))}
                        </select>
                      </div>
                      <div className="form-group">
                        <label>{t.district} <span className="req">*</span></label>
                        <select
                          className="input-field select-field"
                          value={customLocation.district}
                          onChange={(e) => setCustomLocation({ ...customLocation, district: e.target.value })}
                        >
                          {availableDistricts.map((d) => (
                            <option key={d} value={d}>{d}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="form-group">
                      <label>लैंडमार्क / स्थल (Landmark / Street)</label>
                      <input
                        type="text"
                        className="input-field"
                        placeholder="e.g. Near Primary Health Centre"
                        value={customLocation.landmark}
                        onChange={(e) => setCustomLocation({ ...customLocation, landmark: e.target.value })}
                      />
                    </div>
                  </div>
                )}

                {/* Confirmed Location Review Card */}
                <div className="confirmed-loc-card">
                  <div className="conf-row">
                    <span className="conf-icon">📌</span>
                    <div className="conf-detail">
                      <strong>{t.confirmedSpotLabel}</strong>
                      <p>{activeLoc.title}</p>
                    </div>
                  </div>

                  <div className="conf-meta">
                    <span className="conf-pill">{activeLoc.tag}</span>
                    <span className="conf-pill">🏛️ {activeLoc.routing}</span>
                  </div>

                  {/* Checkbox for Final Confirmation */}
                  <label className="loc-confirm-checkbox">
                    <input
                      type="checkbox"
                      checked={isLocationConfirmed}
                      onChange={(e) => setIsLocationConfirmed(e.target.checked)}
                    />
                    <span>{t.confirmCheckboxText}</span>
                  </label>
                </div>
              </div>

              <button type="submit" className="submit-btn" disabled={isSubmitting}>
                {isSubmitting ? 'Google AI Processing...' : t.submitGrievanceBtn}
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
