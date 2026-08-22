import { useState, useRef } from 'react';
import Login from './components/Login';
import { SUPPORTED_LANGUAGES } from './translations';
import './App.css';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState('login'); // 'login' | 'grievance'
  
  // Grievance form state
  const [text, setText] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('hi-IN');
  const [isRecording, setIsRecording] = useState(false);
  const [location, setLocation] = useState(null);
  const [fileName, setFileName] = useState('');
  const [submissionResult, setSubmissionResult] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const recognitionRef = useRef(null);

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    if (user.language) {
      setSelectedLanguage(user.language);
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

  const fetchLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }
    navigator.geolocation.getCurrentPosition((position) => {
      setLocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude
      });
    }, () => {
      alert("Unable to retrieve GPS coordinates. Using district jurisdiction default.");
    });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate Step 2 (Google Gemini 1.5 Flash AI Processing) & Step 3 (Firebase Data Fusion + 3D Twin Sync)
    setTimeout(() => {
      setIsSubmitting(false);
      const isRural = currentUser?.areaType === 'rural';
      setSubmissionResult({
        ticketId: 'JD-' + Math.floor(100000 + Math.random() * 900000),
        translatedText: text.includes('water') || text.includes('पानी') || text.includes('पाणी')
          ? "Critical water infrastructure breakdown & supply failure reported in local jurisdiction." 
          : "Essential public infrastructure grievance logged requiring immediate department intervention.",
        department: text.includes('water') || text.includes('पानी') || text.includes('पाणी') 
          ? "Ministry of Jal Shakti (जल शक्ति) / State Water Board" 
          : "Public Works Department (PWD / लोक निर्माण विभाग)",
        routingUnit: currentUser?.officialRouting || 'District Collector & Municipal Commissioner',
        severityScore: isRural ? '8.8/10 (High Priority - Rural Multiplier Boost)' : '7.4/10 (Standard Severity)',
        jurisdictionSummary: `${currentUser?.state || 'Maharashtra'} • ${currentUser?.district || 'District'} • PIN: ${currentUser?.pincode || '412207'}`
      });
    }, 1200);
  };

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
            {currentUser ? '👤 Citizen Digital ID' : '🌐 Citizen Portal'}
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
                <div><strong>District (DM):</strong> {currentUser.district}</div>
                <div><strong>Area Type:</strong> <span className="highlight-tag">{currentUser.areaType === 'rural' ? 'Rural (Gram Panchayat)' : 'Urban (Municipal Ward)'}</span></div>
                <div><strong>Sub-District:</strong> {currentUser.tehsil || 'Block / Zone'}</div>
                <div><strong>Ward/Panchayat:</strong> {currentUser.panchayatOrWard || 'Local Body'}</div>
                <div><strong>Pincode:</strong> 📮 {currentUser.pincode}</div>
              </div>
              <div className="routing-badge">
                🎯 <strong>Official Routing:</strong> {currentUser.officialRouting || 'BDO / DM Jurisdiction'}
              </div>
              <small className="banner-note">
                💡 Automatically feeds poverty & infrastructure weighting into <strong>Step 3 (3D Digital Twin Map)</strong>
              </small>
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
                <p><strong>Official Routing:</strong> {submissionResult.routingUnit}</p>
                <p><strong>Jurisdiction:</strong> {submissionResult.jurisdictionSummary}</p>
                <p><strong>Auto-Translation:</strong> {submissionResult.translatedText}</p>
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
                  setLocation(null);
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
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.native} ({lang.name})
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
                    placeholder="अपनी समस्या यहाँ लिखें या माइक बटन दबाकर बोलें... (e.g. 'आमच्या गावात पिण्याच्या पाण्याची पाईपलाईन फुटली आहे')"
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

              <div className="action-buttons">
                <button type="button" className="action-btn" onClick={fetchLocation}>
                  📍 {location ? 'GPS प्राप्त (Lat/Lng Attached)' : 'Fetch GPS Coordinates'}
                </button>
                
                <label className="action-btn file-upload">
                  📸 {fileName ? fileName.substring(0, 15) + '...' : 'Upload Photo Proof'}
                  <input type="file" accept="image/*" onChange={handleFileChange} style={{display: 'none'}} />
                </label>
              </div>
              
              {location && (
                <div className="location-info">
                  <small>🎯 Precise GPS Coordinates: {location.lat.toFixed(4)}° N, {location.lng.toFixed(4)}° E</small>
                </div>
              )}

              <button type="submit" className="submit-btn" disabled={isSubmitting}>
                {isSubmitting ? 'Processing with Google AI...' : 'Submit to 3D Digital Twin ➔'}
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
