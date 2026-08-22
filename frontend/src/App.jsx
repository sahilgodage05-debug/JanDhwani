import { useState, useRef } from 'react';
import Login from './components/Login';
import { ALL_LANGUAGES, STATES_AND_DISTRICTS } from './indiaData';
import './App.css';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState('login'); // 'login' | 'grievance'
  
  // Grievance form state
  const [text, setText] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('hi-IN');
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
  
  const recognitionRef = useRef(null);

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
        tag: currentUser.areaType === 'rural' ? 'Rural (Gram Panchayat)' : 'Urban (Municipal Ward)',
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
      tag: 'Custom Incident Location',
      routing: `District Magistrate (${customLocation.district}) & Zonal Engineer`,
      coords: 'Geo-coded from District Node'
    };
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isLocationConfirmed) {
      alert('कृपया शिकायत का स्थान सत्यापित एवं पुष्ट करें (Please verify and confirm the incident location before submission)');
      return;
    }

    setIsSubmitting(true);
    const locInfo = getActiveLocationSummary();

    // Simulate Step 2 (Google Gemini AI) & Step 3 (Firebase Data Fusion + 3D Map Dispatch)
    setTimeout(() => {
      setIsSubmitting(false);
      const isRural = currentUser?.areaType === 'rural' || locationSource === 'registered';
      setSubmissionResult({
        ticketId: 'JD-' + Math.floor(100000 + Math.random() * 900000),
        translatedText: text.includes('water') || text.includes('पानी') || text.includes('पाणी')
          ? "Critical public water pipeline rupture & severe water supply deficit reported in verified jurisdiction." 
          : "Essential public infrastructure defect requiring administrative dispatch.",
        department: text.includes('water') || text.includes('पानी') || text.includes('पाणी') 
          ? "Ministry of Jal Shakti (जल शक्ति) / Water Supply Board" 
          : "Public Works Department (PWD / लोक निर्माण विभाग)",
        confirmedLocation: locInfo.title,
        routingUnit: locInfo.routing,
        severityScore: isRural ? '8.9/10 (High Priority - Rural Multiplier Boost)' : '7.5/10 (Standard Severity)',
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
            {currentUser ? '👤 Citizen Credential' : '🌐 Citizen Portal'}
          </button>
          <button 
            type="button"
            className={`nav-btn ${activeTab === 'grievance' ? 'active' : ''}`}
            onClick={() => setActiveTab('grievance')}
          >
            ✍️ File Grievance (शिकायत)
          </button>
        </div>

        {currentUser ? (
          <div className="user-status-pill">
            <span>👤 {currentUser.fullName?.split(' ')[0]}</span>
            <button 
              type="button" 
              className="logout-link-btn" 
              onClick={handleLogout}
              title="लॉग आउट करें"
            >
              (Logout)
            </button>
          </div>
        ) : (
          <span className="guest-badge">Anonymous Mode</span>
        )}
      </nav>

      {/* Main Content Area */}
      {activeTab === 'login' ? (
        <Login 
          onLoginSuccess={handleLoginSuccess}
          onContinueAsGuest={() => setActiveTab('grievance')}
        />
      ) : (
        <div className="card">
          <div className="card-header">
            <h1 className="title">JanDhwani (जनध्वनि)</h1>
            <p className="subtitle">नागरिक शिकायत पोर्टल • Step 1: Citizen Grievance Gateway</p>
          </div>

          {/* Citizen Attached Demographics Banner */}
          {currentUser && (
            <div className="attached-profile-banner">
              <div className="banner-title">
                <span>🛡️ Verified Citizen Credential Auto-Attached to Ticket:</span>
              </div>
              <div className="banner-grid">
                <div><strong>Citizen:</strong> {currentUser.fullName}</div>
                <div><strong>Mobile (UID):</strong> {currentUser.mobile}</div>
                <div><strong>State & UT:</strong> {currentUser.state}</div>
                <div><strong>District:</strong> {currentUser.district}</div>
                <div><strong>Area Type:</strong> <span className="highlight-tag">{currentUser.areaType === 'rural' ? 'Rural (Gram Panchayat)' : 'Urban (Municipal Ward)'}</span></div>
                <div><strong>Pincode:</strong> 📮 {currentUser.pincode}</div>
              </div>
            </div>
          )}

          {submissionResult ? (
            <div className="success-screen">
              <div className="success-icon">🚀</div>
              <h2>Grievance Dispatched to 3D Digital Twin!</h2>
              <p className="ticket-number">Ticket ID: <strong>{submissionResult.ticketId}</strong></p>
              
              <div className="ai-summary-card">
                <h3>🤖 Step 2: Google Gemini 1.5 Flash AI Processing</h3>
                <p><strong>Department:</strong> {submissionResult.department}</p>
                <p><strong>Confirmed Incident Location:</strong> {submissionResult.confirmedLocation}</p>
                <p><strong>Official Routing Unit:</strong> {submissionResult.routingUnit}</p>
                <p><strong>Auto-Translation (English):</strong> {submissionResult.translatedText}</p>
                <p><strong>Urgency Score (1-10):</strong> <span className="score-badge">{submissionResult.severityScore}</span></p>
              </div>

              <div className="firebase-status">
                <span>📡 Step 3: Synced to Firebase → Glowing 3D Beacon Rises on Minister's Map</span>
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
                + File Another Grievance
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="form">
              {/* Language Selector */}
              <div className="form-group">
                <label>शिकायत इनपुट भाषा (Voice & Speech Recognition Language)</label>
                <select 
                  className="input-field select-field"
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                >
                  {ALL_LANGUAGES.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.native} ({lang.name}) - {lang.region}
                    </option>
                  ))}
                </select>
              </div>

              {/* Grievance Text Area with HTML5 Speech-to-Text */}
              <div className="form-group">
                <label>आपकी शिकायत / मांग (Voice or Text Grievance) <span className="req">*</span></label>
                <div className="textarea-container">
                  <textarea 
                    rows="5" 
                    placeholder="अपनी समस्या यहाँ लिखें या माइक बटन दबाकर बोलें... (उदा. 'आमच्या गावात पिण्याच्या पाण्याची मुख्य लाईन फुटली आहे')"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    required
                  />
                  <button 
                    type="button" 
                    className={`mic-button ${isRecording ? 'recording' : ''}`}
                    onClick={startRecording}
                    title="बोलकर टाइप करें (Voice Input)"
                  >
                    {isRecording ? '🎙️ सुन रहा है...' : '🎙️ Record Voice'}
                  </button>
                </div>
              </div>

              {/* Evidence Upload */}
              <div className="action-buttons">
                <label className="action-btn file-upload">
                  📸 {fileName ? fileName.substring(0, 18) + '...' : 'Upload Photo / Video Evidence'}
                  <input type="file" accept="image/*" onChange={handleFileChange} style={{display: 'none'}} />
                </label>
              </div>

              {/* =========================================================================
                 LOCATION CONFIRMATION SECTION (MANDATORY VERIFICATION BEFORE DISPATCH)
                 ========================================================================= */}
              <div className="location-confirm-section">
                <div className="loc-section-header">
                  <span className="loc-title">📍 घटना स्थल चयन एवं पुष्टि (Incident Location Confirmation)</span>
                  <span className="loc-sub">Ensure the 3D beacon accurately rises at the problem site</span>
                </div>

                {/* Location Source Selector Tabs */}
                <div className="loc-source-tabs">
                  <button
                    type="button"
                    className={`loc-tab ${locationSource === 'registered' ? 'active' : ''}`}
                    onClick={() => { setLocationSource('registered'); setIsLocationConfirmed(true); }}
                  >
                    🏠 पंजीकृत पता (Profile Address)
                  </button>
                  <button
                    type="button"
                    className={`loc-tab ${locationSource === 'gps' ? 'active' : ''}`}
                    onClick={fetchLiveGps}
                  >
                    📍 लाइव GPS (Current Device Location)
                  </button>
                  <button
                    type="button"
                    className={`loc-tab ${locationSource === 'custom' ? 'active' : ''}`}
                    onClick={() => { setLocationSource('custom'); setIsLocationConfirmed(true); }}
                  >
                    📝 अन्य स्थल (Different Spot)
                  </button>
                </div>

                {/* Custom Location Fields (if chosen) */}
                {locationSource === 'custom' && (
                  <div className="custom-loc-fields">
                    <div className="form-row">
                      <div className="form-group">
                        <label>राज्य (State) *</label>
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
                        <label>जिला (District) *</label>
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
                      <label>घटना स्थल का विवरण / लैंडमार्क (Landmark / Street / Area)</label>
                      <input
                        type="text"
                        className="input-field"
                        placeholder="उदा. Main Market Road, Near Primary Health Centre"
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
                      <strong>सत्यापित घटना स्थल (Confirmed Spot):</strong>
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
                    <span>
                      मैं पुष्टि करता/करती हूँ कि यह घटना का सही स्थान है (I confirm this is the exact problem location for 3D map plotting & official inspection)
                    </span>
                  </label>
                </div>
              </div>

              <button type="submit" className="submit-btn" disabled={isSubmitting}>
                {isSubmitting ? 'Google AI द्वारा विश्लेषण हो रहा है...' : '3D डिजिटल ट्विन पर प्रेषित करें (Submit Grievance) ➔'}
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
