import re

with open('frontend/src/components/login/Login.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

aadhaar_field = '''            <div className="form-group">
              <label>Aadhaar Number (UIDAI) <span className="req">*</span></label>
              <input 
                type="text"
                className={`input-field ${touched.aadhaar && errors.aadhaar ? 'input-error' : ''}`}
                placeholder="12-digit Aadhaar"
                value={regData.aadhaar}
                onChange={(e) => handleAadhaarChange(e.target.value)}
                onBlur={() => handleBlur('aadhaar')}
                required
              />
              {touched.aadhaar && errors.aadhaar && (
                <span className="error-text">{errors.aadhaar}</span>
              )}
            </div>
            
            <div className="form-group" style={{gridColumn: '1 / -1', background: '#e3f2fd', padding: '15px', borderRadius: '10px', marginTop: '10px'}}>
              <label style={{color: '#1565c0'}}>GPS Location Verification <span className="req">*</span></label>
              <p style={{fontSize: '0.85rem', color: '#333', marginBottom: '10px'}}>Location is mandatory to route your grievance to the correct local authority.</p>
              <button 
                type="button" 
                className={`gps-btn ${gpsStatus?.granted ? 'active' : ''}`}
                onClick={requestLocationPermission}
                style={{width: '100%', padding: '12px', background: gpsStatus?.granted ? '#4caf50' : '#1a73e8', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold'}}
              >
                {gpsStatus?.granted ? '✓ GPS Location Detected' : '📍 Detect My Location'}
              </button>
            </div>'''

new_content = re.sub(
    r'\{\/\* Section 2: Location & Administrative Geography \*\/\}.*?\{\/\* Section 3: Security \*\/\}',
    aadhaar_field + '\n\n          {/* Section 3: Security */}',
    content,
    flags=re.DOTALL
)

with open('frontend/src/components/login/Login.jsx', 'w', encoding='utf-8') as f:
    f.write(new_content)
