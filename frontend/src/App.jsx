import { useState, useRef } from 'react';
import './App.css';

function App() {
  const [text, setText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [location, setLocation] = useState(null);
  const [fileName, setFileName] = useState('');
  
  const recognitionRef = useRef(null);

  const startRecording = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("Your browser doesn't support speech recognition. Please type your grievance.");
      return;
    }
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = false;
    // Set language to Hindi as default for India, or let it detect
    recognitionRef.current.lang = 'hi-IN';
    recognitionRef.current.interimResults = false;

    recognitionRef.current.onstart = () => {
      setIsRecording(true);
    };

    recognitionRef.current.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setText(prevText => prevText + ' ' + transcript);
      setIsRecording(false);
    };

    recognitionRef.current.onerror = (event) => {
      console.error(event.error);
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
      alert("Unable to retrieve your location. Please check browser permissions.");
    });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Grievance Submitted Successfully (Prototype)");
    // Reset form
    setText('');
    setLocation(null);
    setFileName('');
  };

  return (
    <div className="container">
      <div className="card">
        <h1 className="title">JanDhwani</h1>
        <p className="subtitle">नागरिक शिकायत पोर्टल (Citizen Grievance Gateway)</p>
        
        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label>आपकी शिकायत (Your Grievance)</label>
            <div className="textarea-container">
              <textarea 
                rows="6" 
                placeholder="अपनी समस्या यहाँ लिखें या माइक बटन दबाकर बोलें..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                required
              />
              <button 
                type="button" 
                className={`mic-button ${isRecording ? 'recording' : ''}`}
                onClick={startRecording}
                title="बोलकर टाइप करें"
              >
                {isRecording ? '🎙️ सुन रहा है...' : '🎙️ Mic'}
              </button>
            </div>
          </div>

          <div className="action-buttons">
            <button type="button" className="action-btn" onClick={fetchLocation}>
              📍 {location ? 'लोकेशन मिल गई (Fetched)' : 'Fetch Current Location'}
            </button>
            
            <label className="action-btn file-upload">
              📸 {fileName ? fileName.substring(0, 15) + '...' : 'Upload Evidence (Photo)'}
              <input type="file" accept="image/*" onChange={handleFileChange} style={{display: 'none'}} />
            </label>
          </div>
          
          {location && (
            <div className="location-info">
              <small>Latitude: {location.lat.toFixed(4)}, Longitude: {location.lng.toFixed(4)}</small>
            </div>
          )}

          <button type="submit" className="submit-btn">Submit Grievance</button>
        </form>
      </div>
    </div>
  )
}

export default App;
