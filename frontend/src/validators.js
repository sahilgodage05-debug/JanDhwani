// Validation utilities for Indian Citizen Registration & Governance Data
export const VALIDATION_RULES = {
  // Indian Mobile Number: 10 digits starting with 6, 7, 8, or 9
  mobile: (val) => {
    if (!val) return 'मोबाइल नंबर आवश्यक है (Mobile number is required)';
    const clean = val.replace(/\D/g, '');
    if (clean.length !== 10) return 'मोबाइल नंबर ठीक 10 अंकों का होना चाहिए (Mobile must be exactly 10 digits)';
    if (!/^[6-9]/.test(clean)) return 'मोबाइल नंबर 6, 7, 8 या 9 से शुरू होना चाहिए (Must start with 6, 7, 8, or 9)';
    return null;
  },

  // Indian Pincode: Exactly 6 digits, 1st digit 1-8
  pincode: (val) => {
    if (!val) return 'पिन कोड आवश्यक है (Pincode is required)';
    const clean = val.replace(/\D/g, '');
    if (clean.length !== 6) return 'पिन कोड 6 अंकों का होना चाहिए (Pincode must be exactly 6 digits)';
    if (!/^[1-8]/.test(clean)) return 'अमान्य भारतीय पिन कोड (Invalid Indian Postal Code: must start with 1-8)';
    return null;
  },

  // Full Name: At least 3 characters, alphabets & spaces only
  fullName: (val) => {
    if (!val || val.trim().length < 3) return 'कृपया पूरा नाम दर्ज करें (कम से कम 3 अक्षर)';
    if (/[0-9!@#$%^&*()_+={}\[\]:;"'<>,.?/\\|`~]/.test(val)) {
      return 'नाम में केवल अक्षर होने चाहिए (Name must not contain digits or special characters)';
    }
    return null;
  },

  // Email (Optional, but if filled must be valid)
  email: (val) => {
    if (!val || val.trim() === '') return null;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(val.trim())) return 'कृपया मान्य ईमेल पता दर्ज करें (Enter a valid email address)';
    return null;
  },

  // Password: Minimum 6 characters
  password: (val) => {
    if (!val || val.length < 6) return 'पासवर्ड कम से कम 6 अक्षरों का होना चाहिए (Minimum 6 characters)';
    return null;
  },

  // District / City
  district: (val) => {
    if (!val || val.trim().length < 2) return 'कृपया जिला चुनें (Please select or enter District)';
    return null;
  },

  // Sub-district / Tehsil / Ward
  subArea: (val, areaType) => {
    if (!val || val.trim().length < 2) {
      return areaType === 'rural' 
        ? 'कृपया तहसील / ब्लॉक दर्ज करें (Enter Tehsil / Block)' 
        : 'कृपया नगर निगम वार्ड संख्या दर्ज करें (Enter Municipal Ward No.)';
    }
    return null;
  }
};
