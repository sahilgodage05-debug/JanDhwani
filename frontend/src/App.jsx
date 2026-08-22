import { useState, useRef } from 'react';
import Login from './components/Login';
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
      const code = user.language.split(' ')[0];
      setSelectedLanguage(code);
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

    // Simulate Step 2 (Google Gemini 1.5 Flash AI Processing) & Step 3 (Firebase Real-time Sync)
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmissionResult({
        ticketId: 'JD-' + Math.floor(100000 + Math.random() * 900000),
        translatedText: text.includes('water') || text.includes('पानी') 
          ? "Critical water supply disruption & infrastructure failure reported." 
          : "Infrastructure grievance reported requiring administrative intervention.",
        department: text.includes('water') || text.includes('पानी') ? "Jal Shakti (जल शक्ति मंत्रालय)" : "Public Works Department (PWD)",
        severityScore: currentUser?.areaType?.includes('Rural') ? '8.5/10 (High Priority - Rural Boost)' : '7.2/10',
        syncedTo3DMap: true
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
            {currentUser ? '👤 Citizen ID' : '🔐 Citizen Portal'}
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
            <span>👤 {currentUser.fullName || currentUser.name}</span>
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
            <p className="subtitle">नागरिक शिकायत पोर्टल • Citizen Grievance Gateway (Step 1)</p>
          </div>

          {/* Citizen Attached Demographics Banner */}
          {currentUser && (
            <div className="attached-profile-banner">
              <div className="banner-title">
                <span>🛡️ Verified Citizen Credential Auto-Attached:</span>
              </div>
              <div className="banner-grid">
                <div><strong>Citizen:</strong> {currentUser.fullName}</div>
                <div><strong>State:</strong> {currentUser.state}</div>
                <div><strong>District:</strong> {currentUser.district || 'Purnia'}</div>
                <div><strong>Area:</strong> <span className="highlight-tag">{currentUser.areaType || 'Rural'}</span></div>
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
                <h3>🤖 Step 2: Google Gemini AI Processing</h3>
                <p><strong>Classified Department:</strong> {submissionResult.department}</p>
                <p><strong>English Translation:</strong> {submissionResult.translatedText}</p>
                <p><strong>Urgency Score (1-10):</strong> <span className="score-badge">{submissionResult.severityScore}</span></p>
              </div>

              <div className="firebase-status">
                <span>📡 Step 3: Synced to Firebase → Glowing 3D Beacon Generated on Minister's Map</span>
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
                <label>शिकायत की भाषा (Input Language for Speech & Text)</label>
                <select 
                  className="input-field select-field"
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                >
                  <option value="hi-IN">हिंदी (Hindi / Bhojpuri)</option>
                  <option value="en-IN">English (Indian)</option>
                  <option value="ta-IN">தமிழ் (Tamil)</option>
                  <option value="te-IN">తెలుగు (Telugu)</option>
                  <option value="bn-IN">বাংলা (Bengali)</option>
                  <option value="mr-IN">मराठी (Marathi)</option>
                  <option value="gu-IN">ગુજરાતી (Gujarati)</option>
                  <option value="kn-IN">ಕನ್ನಡ (Kannada)</option>
                  <option value="pt-BR">Português (Brazil BRICS Demo)</option>
                </select>
              </div>

              {/* Grievance Text Area with HTML5 Speech-to-Text */}
              <div className="form-group">
                <label>आपकी शिकायत / मांग (Your Grievance / Demand) <span className="req">*</span></label>
                <div className="textarea-container">
                  <textarea 
                    rows="5" 
                    placeholder="अपनी समस्या यहाँ लिखें या माइक बटन दबाकर बोलें... (e.g., 'हमारे गांव में पानी की टंकी टूट गई है')"
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
                  📍 {location ? 'GPS प्राप्त (Lat/Lng Attached)' : 'Fetch GPS Location'}
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
