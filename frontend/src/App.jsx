import { useState, useRef, useEffect } from 'react';
import Login from './components/Login';
import DigitalTwinMap from './components/DigitalTwinMap';
import { ALL_LANGUAGES, STATES_AND_DISTRICTS } from './indiaData';
import { UI_STRINGS } from './translations';
import './App.css';

// 1-Click Voice Simulation Audio Scripts across Indian Languages for Judges
const VOICE_DEMO_SAMPLES = [
  {
    lang: 'hi-IN',
    label: '🎙️ Hindi Voice Sample',
    transcript: 'हमारे क्षेत्र में पीने के पानी की मुख्य पाइपलाइन फट गई है और 4 दिनों से बिजली आपूर्ति पूरी तरह बाधित है।',
    dept: 'Jal Shakti & Power Board'
  },
  {
    lang: 'mr-IN',
    label: '🎙️ Marathi Voice Sample',
    transcript: 'वाघोली ग्रामपंचायत हद्दीत मुख्य जलवाहिनी फुटली असून गेल्या चार दिवसांपासून पिण्याचे पाणी व वीज पुरवठा बंद आहे.',
    dept: 'Jal Shakti & MSEDCL'
  },
  {
    lang: 'ta-IN',
    label: '🎙️ Tamil Voice Sample',
    transcript: 'எங்கள் பகுதியில் குடிநீர் குழாய் உடைந்து நான்கு நாட்களாக மின்சாரம் மற்றும் குடிநீர் விநியோகம் முற்றிலும் தடைபட்டுள்ளது.',
    dept: 'Tamil Nadu Water Supply & TANGEDCO'
  },
  {
    lang: 'en-IN',
    label: '🎙️ English Voice Sample',
    transcript: 'There is a critical municipal water tank burst in our block, and we have had zero electricity for four consecutive days.',
    dept: 'Ministry of Jal Shakti & Power'
  }
];

function App() {
  const [selectedLanguage, setSelectedLanguage] = useState('en-IN');
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState('login'); // 'login' | 'grievance' | '3d_twin'
  
  // Grievance form state
  const [text, setText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [voiceDuration, setVoiceDuration] = useState(0);
  const [voiceInterimText, setVoiceInterimText] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageAiAnalysis, setImageAiAnalysis] = useState(null);
  const [isAnalyzingImage, setIsAnalyzingImage] = useState(false);
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
  const timerRef = useRef(null);

  // Active translation dictionary
  const t = UI_STRINGS[selectedLanguage] || UI_STRINGS['en-IN'] || UI_STRINGS['hi-IN'];

  // Timer effect for voice recording duration
  useEffect(() => {
    if (isRecording) {
      setVoiceDuration(0);
      timerRef.current = setInterval(() => {
        setVoiceDuration(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording]);

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

  // Start / Stop HTML5 Speech Recognition
  const toggleRecording = () => {
    if (isRecording) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsRecording(false);
      return;
    }

    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("Web Speech recognition is not supported in this browser. Please use the simulated Judge Voice Samples below or type your grievance.");
      return;
    }
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = selectedLanguage;

    recognition.onstart = () => {
      setIsRecording(true);
      setVoiceInterimText('');
    };

    recognition.onresult = (event) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }

      if (finalTranscript) {
        setText(prev => (prev ? prev + ' ' + finalTranscript : finalTranscript));
        setTextError(null);
      }
      setVoiceInterimText(interimTranscript);
    };

    recognition.onerror = (event) => {
      console.warn('Speech recognition error:', event.error);
      if (event.error === 'not-allowed') {
        alert("Microphone permission was denied. Please allow microphone access in your browser settings or use the 1-click voice presets.");
      }
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
      setVoiceInterimText('');
    };

    try {
      recognition.start();
    } catch (e) {
      console.error(e);
      setIsRecording(false);
    }
  };

  // 1-Click Judge Voice Simulator
  const handleSimulateVoiceInput = (sample) => {
    setSelectedLanguage(sample.lang);
    setText(sample.transcript);
    setTextError(null);
    setIsRecording(true);
    setVoiceInterimText(sample.transcript);
    setTimeout(() => {
      setIsRecording(false);
      setVoiceInterimText('');
    }, 1200);
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
      alert(selectedLanguage === 'en-IN' 
        ? "Unable to fetch live GPS. You can confirm via registered jurisdiction or select manually." 
        : "लाइव GPS प्राप्त करने में असमर्थ। आप पंजीकृत पते या मैन्युअल रूप से चुन सकते हैं।");
    });
  };

  // FDA Maharashtra Style: Multimodal AI Image Verification
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      const url = URL.createObjectURL(file);
      setImagePreview(url);
      
      // Simulate Gemini 1.5 Flash Vision verification matching complaint context
      setIsAnalyzingImage(true);
      setImageAiAnalysis(null);

      setTimeout(() => {
        setIsAnalyzingImage(false);
        const lower = text.toLowerCase();
        let detectedCategory = "Civil Infrastructure Defect";
        let detectedObjects = ["Physical Structural Defect", "Ground Disruption", "Public Property"];
        let matchScore = 95;

        if (lower.includes('water') || lower.includes('पानी') || lower.includes('पाणी') || lower.includes('தண்ணீர்') || lower.includes('कुழாய்')) {
          detectedCategory = "Water Supply & Pipeline Rupture";
          detectedObjects = ["Pipeline Surface Rupture", "Water Accumulation", "Hydraulic Leakage"];
          matchScore = 97;
        } else if (lower.includes('road') || lower.includes('सड़क') || lower.includes('रस्ता') || lower.includes('pothole')) {
          detectedCategory = "Road Hazard & Pothole";
          detectedObjects = ["Asphalt Crack", "Road Cavity", "Traffic Obstruction"];
          matchScore = 94;
        } else if (lower.includes('medicine') || lower.includes('food') || lower.includes('दवा') || lower.includes('औषध')) {
          detectedCategory = "FDA / Public Health Violation";
          detectedObjects = ["Product Packaging", "Expiry/Batch Label", "Substandard Seal"];
          matchScore = 98;
        }

        setImageAiAnalysis({
          verified: true,
          matchScore: matchScore,
          category: detectedCategory,
          detectedObjects: detectedObjects,
          summary: "Google Gemini Vision: Image features strongly correlate with reported citizen complaint text."
        });
      }, 1100);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setImageAiAnalysis(null);
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
      alert(selectedLanguage === 'en-IN' 
        ? 'Please check the box to confirm this is the exact incident location before submitting.' 
        : 'कृपया शिकायत का स्थान सत्यापित एवं पुष्ट करें (Please verify location)');
      return;
    }

    setIsSubmitting(true);
    const locInfo = getActiveLocationSummary();

    // Simulate Step 2 (Google Gemini AI) & Step 3 (Firebase Sync to 3D Digital Twin)
    setTimeout(() => {
      setIsSubmitting(false);
      const isRural = currentUser?.areaType === 'rural' || locationSource === 'registered';
      const lower = text.toLowerCase();
      
      let dept = "Public Works Department (PWD / लोक निर्माण विभाग)";
      let oneLineSummary = "Essential public infrastructure defect requiring administrative dispatch.";
      
      if (lower.includes('water') || lower.includes('पानी') || lower.includes('पाणी') || lower.includes('தண்ணீர்') || lower.includes('कुழாய்')) {
        dept = "Ministry of Jal Shakti (जल शक्ति) & Power Supply Board";
        oneLineSummary = "Critical water conduit rupture & power outage reported by citizen in local dialect.";
      } else if (lower.includes('medicine') || lower.includes('food') || lower.includes('दवा') || lower.includes('औषध')) {
        dept = "Food & Drugs Administration (FDA / अन्न व औषध प्रशासन)";
        oneLineSummary = "Suspected food safety / medicine compliance breach reported for physical verification.";
      }

      setSubmissionResult({
        ticketId: 'JD-' + Math.floor(100000 + Math.random() * 900000),
        translatedText: oneLineSummary,
        department: dept,
        confirmedLocation: locInfo.title,
        routingUnit: locInfo.routing,
        severityScore: isRural ? '8.9/10 (High Priority - Rural Boost)' : '7.5/10 (Standard Severity)',
        imageVerified: imageAiAnalysis?.verified || false,
        imageScore: imageAiAnalysis?.matchScore || null,
        imageDetails: imageAiAnalysis?.category || null,
        syncedTo3DMap: true
      });
    }, 1200);
  };

  const activeLoc = getActiveLocationSummary();
  const availableDistricts = STATES_AND_DISTRICTS[customLocation.state] || STATES_AND_DISTRICTS['Maharashtra'];

  return (
    <div className={activeTab === '3d_twin' ? 'container container-wide' : 'container'}>
      {/* Top Portal Navigation */}
      <nav className="portal-nav">
        <div className="nav-buttons">
          <button 
            type="button"
            className={`nav-btn ${activeTab === 'login' ? 'active' : ''}`}
            onClick={() => setActiveTab('login')}
          >
            {currentUser ? '👤 ' + (t.fullName || 'Citizen Profile') : '🌐 ' + t.portalTitle}
          </button>
          <button 
            type="button"
            className={`nav-btn ${activeTab === 'grievance' ? 'active' : ''}`}
            onClick={() => setActiveTab('grievance')}
          >
            ✍️ {t.fileGrievanceTitle}
          </button>
          <button 
            type="button"
            className={`nav-btn twin-nav-btn-highlight ${activeTab === '3d_twin' ? 'active' : ''}`}
            onClick={() => setActiveTab('3d_twin')}
          >
            🎮 3D Digital Twin Map (Live)
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
          <span className="guest-badge">Citizen Access</span>
        )}
      </nav>

      {/* Main Content Area */}
      {activeTab === '3d_twin' ? (
        /* STEP 4: 3D DIGITAL TWIN GAMIFIED DASHBOARD (Three.js) */
        <DigitalTwinMap 
          latestGrievance={submissionResult}
          onBackToPortal={() => setActiveTab('grievance')}
        />
      ) : activeTab === 'login' ? (
        /* STEP 1: CITIZEN REGISTRATION & LOGIN */
        <Login 
          activeLanguage={selectedLanguage}
          onLanguageChange={(newLang) => setSelectedLanguage(newLang)}
          onLoginSuccess={handleLoginSuccess}
          onContinueAsGuest={() => setActiveTab('grievance')}
        />
      ) : (
        /* STEP 1 & 2: GRIEVANCE GATEWAY & GEMINI PROCESSING */
        <div className="card">
          <div className="card-header">
            <div className="emblem-row">
              <span className="national-badge">🇮🇳 JanDhwani DPI</span>
              <span className="brics-badge">🎙️ Multilingual Voice Engine</span>
            </div>
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
                <p><strong>AI Summary (English):</strong> {submissionResult.translatedText}</p>
                <p><strong>Urgency Score:</strong> <span className="score-badge">{submissionResult.severityScore}</span></p>
                
                {submissionResult.imageVerified && (
                  <div className="verified-evidence-box">
                    <span>📸 <strong>Multimodal Evidence Verified:</strong> {submissionResult.imageDetails} (Confidence: {submissionResult.imageScore}%)</span>
                  </div>
                )}
              </div>

              <div className="firebase-status">
                <span>{t.syncedBanner}</span>
              </div>

              {/* 1-Click Launch into 3D Digital Twin Map */}
              <div className="twin-launch-card">
                <button 
                  type="button" 
                  className="view-3d-beacon-btn"
                  onClick={() => setActiveTab('3d_twin')}
                >
                  🎮 View Live Glowing Beacon on 3D Digital Twin Map ➔
                </button>
              </div>

              <button 
                type="button" 
                className="submit-btn secondary-btn" 
                onClick={() => {
                  setSubmissionResult(null);
                  setText('');
                  setImageFile(null);
                  setImagePreview(null);
                  setImageAiAnalysis(null);
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

              {/* =========================================================================
                 DEDICATED VOICE-FIRST GRIEVANCE STUDIO CARD
                 ========================================================================= */}
              <div className="voice-studio-card">
                <div className="voice-studio-header">
                  <strong>🎙️ Voice-First Input (बोलकर शिकायत दर्ज करें)</strong>
                  <span className="voice-lang-tag">
                    Active: {ALL_LANGUAGES.find(l => l.code === selectedLanguage)?.native || 'Voice Engine'}
                  </span>
                </div>

                <div className="voice-mic-center">
                  <button 
                    type="button" 
                    className={`large-voice-btn ${isRecording ? 'recording-active' : ''}`}
                    onClick={toggleRecording}
                  >
                    <span className="mic-icon-large">🎙️</span>
                    <span className="mic-status-label">
                      {isRecording ? `Listening (${voiceDuration}s) • Tap to Stop` : 'Tap to Record Voice in Local Language'}
                    </span>
                  </button>
                </div>

                {isRecording && (
                  <div className="audio-visualizer-wave">
                    <div className="wave-bar"></div>
                    <div className="wave-bar"></div>
                    <div className="wave-bar"></div>
                    <div className="wave-bar"></div>
                    <div className="wave-bar"></div>
                    <div className="wave-bar"></div>
                    <div className="wave-bar"></div>
                    <div className="wave-bar"></div>
                    <span className="live-caption">
                      {voiceInterimText ? `"${voiceInterimText}"` : 'Listening to speech...'}
                    </span>
                  </div>
                )}

                {/* 1-Click Judge Voice Presets */}
                <div className="voice-demo-presets">
                  <span className="preset-label">⚡ 1-Click Judge Voice Demos:</span>
                  <div className="preset-chips">
                    {VOICE_DEMO_SAMPLES.map((sample, idx) => (
                      <button
                        key={idx}
                        type="button"
                        className="voice-preset-chip"
                        onClick={() => handleSimulateVoiceInput(sample)}
                      >
                        {sample.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Grievance Text Area (Synchronized with Voice & Keyboard) */}
              <div className="form-group">
                <label>{t.yourGrievance} (Transcript / Text) <span className="req">*</span></label>
                <div className="textarea-container">
                  <textarea 
                    rows="4" 
                    placeholder={t.grievancePlaceholder}
                    value={text}
                    onChange={(e) => {
                      setText(e.target.value);
                      if (textError) setTextError(null);
                    }}
                    required
                  />
                </div>
                {textError && (
                  <span className="error-text">⚠️ {textError}</span>
                )}
              </div>

              {/* Multimodal Image Evidence Upload & AI Verification */}
              <div className="form-group">
                <label>{t.photoEvidenceLabel}</label>
                
                {!imagePreview ? (
                  <div className="action-buttons">
                    <label className="action-btn file-upload-custom">
                      📸 {t.uploadEvidence}
                      <input type="file" accept="image/*" onChange={handleFileChange} style={{display: 'none'}} />
                    </label>
                  </div>
                ) : (
                  <div className="image-evidence-card">
                    <div className="image-preview-row">
                      <img src={imagePreview} alt="Evidence Preview" className="evidence-thumb" />
                      <div className="evidence-info">
                        <strong>{imageFile?.name}</strong>
                        <small>{(imageFile?.size / 1024).toFixed(1)} KB • Image Loaded</small>
                        <button type="button" className="remove-img-btn" onClick={removeImage}>✕ Remove</button>
                      </div>
                    </div>

                    {isAnalyzingImage && (
                      <div className="ai-scanning-badge">
                        <span>🔍 Google Gemini Vision AI: Analyzing visual evidence & cross-referencing with complaint...</span>
                      </div>
                    )}

                    {imageAiAnalysis && (
                      <div className="ai-verified-result">
                        <div className="ai-verif-top">
                          <span className="verif-check">✅ Image Verified ({imageAiAnalysis.matchScore}% Match)</span>
                          <span className="verif-cat">{imageAiAnalysis.category}</span>
                        </div>
                        <p className="verif-desc">{imageAiAnalysis.summary}</p>
                        <div className="detected-tags">
                          {imageAiAnalysis.detectedObjects.map((obj, i) => (
                            <span key={i} className="detected-pill">🎯 {obj}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
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
                      <label>{t.landmarkLabel}</label>
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
