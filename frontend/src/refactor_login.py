import re

def refactor():
    with open('frontend/src/components/login/Login.jsx', 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Update regData state
    new_reg_data = """const [regData, setRegData] = useState({
  fullName: '',
  mobile: '',
  email: '',
  aadhaar: '',
  password: '',
  confirmPassword: ''
});"""
    content = re.sub(
        r'const \[regData, setRegData\] = useState\(\{.*?\}\);',
        new_reg_data,
        content,
        flags=re.DOTALL
    )

    # 2. Add handleAadhaarChange
    aadhaar_handler = """  const handleAadhaarChange = (val) => {
    const sanitized = val.replace(/\D/g, '').slice(0, 12);
    setRegData(prev => ({ ...prev, aadhaar: sanitized }));
    if (touched.aadhaar) validateField('aadhaar', sanitized);
  };
"""
    content = content.replace('  // Sanitized Name Change', aadhaar_handler + '\n  // Sanitized Name Change')

    # 3. Add validation logic
    content = content.replace(
        "if (field === 'mobile') error = VALIDATION_RULES.mobile(value) ? `${t.requiredErr} (10 digits, 6-9)` : null;",
        "if (field === 'mobile') error = VALIDATION_RULES.mobile(value) ? `${t.requiredErr} (10 digits, 6-9)` : null;\n    if (field === 'aadhaar') error = value.length !== 12 ? `${t.requiredErr} (12 digits required)` : null;"
    )

    # 4. Remove location validation rules from validateField
    content = re.sub(r'if \(field === \'pincode\'\).*?\n', '', content)
    content = re.sub(r'if \(field === \'district\'\).*?\n', '', content)
    content = re.sub(r'if \(field === \'tehsil\'\).*?\n', '', content)
    content = re.sub(r'if \(field === \'panchayatOrWard\'\).*?\n', '', content)

    # 5. Remove handlePincodeChange
    content = re.sub(r'// Smart Pincode Auto-Fill & Validation.*?// Flipkart', '// Flipkart', content, flags=re.DOTALL)

    # 6. Make GPS Mandatory in submit
    content = content.replace(
        "if (!regData.tehsil && !regData.panchayatOrWard) isValid = false;",
        "if (!regData.aadhaar || regData.aadhaar.length !== 12) isValid = false;\n    if (!gpsStatus || !gpsStatus.granted) {\n      alert('Please click \\'Detect My Location\\' (GPS) to proceed.');\n      return;\n    }"
    )
    content = content.replace("if (!regData.pincode || regData.pincode.length !== 6) isValid = false;", "")
    content = content.replace("if (!regData.district) isValid = false;", "")

    # 7. Update handleGoogleLogin
    google_handler = """  const handleGoogleLogin = async () => {
    setIsLoggingIn(true);
    // Google Mock
    setTimeout(() => {
      setIsLoggingIn(false);
      setAuthMode('register');
      setRegData(prev => ({
        ...prev,
        fullName: 'Citizen (Google)',
        email: 'citizen@gmail.com'
      }));
      alert('Google Login Successful! Please complete the remaining mandatory fields (Aadhaar, Mobile, Location).');
    }, 1000);
  };"""
    content = re.sub(r'const handleGoogleLogin = async \(\) => \{.*?\};', google_handler, content, flags=re.DOTALL)

    # 8. Update JSX - Remove Section 2 entirely and replace with Aadhaar
    # The registration form JSX has Section 1 (Personal Info) and Section 2 (Location Info).
    # We want to add Aadhaar to Section 1, and remove Section 2.
    
    # Let's write the Aadhaar field
    aadhaar_field = """            <div className="form-group">
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
            </div>"""
    
    # We replace from Section 2 to Section 3 with our new fields
    content = re.sub(
        r'{/\* Section 2: Smart Location & Auto-Routing \*/}.*?{/\* Section 3: Security \*/}',
        aadhaar_field + '\n\n          {/* Section 3: Security */}',
        content,
        flags=re.DOTALL
    )

    with open('frontend/src/components/login/Login.jsx', 'w', encoding='utf-8') as f:
        f.write(content)

if __name__ == '__main__':
    refactor()
