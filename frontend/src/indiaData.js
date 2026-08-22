// All 22 Official 8th Schedule Languages of India + Widely Spoken Regional & BRICS Languages
export const ALL_LANGUAGES = [
  // National & Popular
  { code: 'hi-IN', name: 'Hindi', native: 'हिंदी', script: 'नमस्ते', region: 'National / North', popular: true },
  { code: 'en-IN', name: 'English', native: 'English', script: 'Welcome', region: 'National / Pan-India', popular: true },
  { code: 'mr-IN', name: 'Marathi', native: 'मराठी', script: 'नमस्कार', region: 'West (Maharashtra)', popular: true },
  { code: 'bn-IN', name: 'Bengali', native: 'বাংলা', script: 'নমস্কার', region: 'East (West Bengal / Tripura)', popular: true },
  { code: 'ta-IN', name: 'Tamil', native: 'தமிழ்', script: 'வணக்கம்', region: 'South (Tamil Nadu / Puducherry)', popular: true },
  { code: 'te-IN', name: 'Telugu', native: 'తెలుగు', script: 'నమస్కారం', region: 'South (Andhra Pradesh / Telangana)', popular: true },
  
  // West India
  { code: 'gu-IN', name: 'Gujarati', native: 'ગુજરાતી', script: 'નમસ્તે', region: 'West (Gujarat)' },
  { code: 'kok-IN', name: 'Konkani', native: 'कोंकणी', script: 'देव बरें करूं', region: 'West (Goa / Coastal)' },
  { code: 'sd-IN', name: 'Sindhi', native: 'سنڌي / सिन्धी', script: 'آداﺏ / नमस्कार', region: 'West / Pan-India' },
  
  // South India
  { code: 'kn-IN', name: 'Kannada', native: 'ಕನ್ನಡ', script: 'ನಮಸ್ಕಾರ', region: 'South (Karnataka)', popular: true },
  { code: 'ml-IN', name: 'Malayalam', native: 'മലയാളം', script: 'നമസ്കാരം', region: 'South (Kerala / Lakshadweep)', popular: true },
  
  // North & Central India
  { code: 'pa-IN', name: 'Punjabi', native: 'ਪੰਜਾਬੀ', script: 'ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ', region: 'North (Punjab / Delhi)', popular: true },
  { code: 'ur-IN', name: 'Urdu', native: 'اردو', script: 'آداب', region: 'North / Pan-India' },
  { code: 'ks-IN', name: 'Kashmiri', native: 'کٲشُر / कश्मीरी', script: 'سلام / नमस्कार', region: 'North (Jammu & Kashmir)' },
  { code: 'doi-IN', name: 'Dogri', native: 'डोगरी', script: 'नमस्कार', region: 'North (Jammu)' },
  { code: 'sa-IN', name: 'Sanskrit', native: 'संस्कृतम्', script: 'नमो नमः', region: 'National / Classical' },
  
  // East & North-East India
  { code: 'or-IN', name: 'Odia', native: 'ଓଡ଼ିଆ', script: 'ନମସ୍କାର', region: 'East (Odisha)', popular: true },
  { code: 'as-IN', name: 'Assamese', native: 'অসমীয়া', script: 'নমস্কাৰ', region: 'North-East (Assam)', popular: true },
  { code: 'mai-IN', name: 'Maithili', native: 'मैथिली', script: 'प्रणाम', region: 'East (Bihar / Mithila)' },
  { code: 'bho-IN', name: 'Bhojpuri', native: 'भोजपुरी', script: 'प्रणाम', region: 'East (Bihar / UP)' },
  { code: 'sat-IN', name: 'Santali', native: 'ᱥᱟᱱᱛᱟᱲᱤ', script: 'ᱡᱚᱦᱟᱨ', region: 'East (Jharkhand / Odisha)' },
  { code: 'mni-IN', name: 'Manipuri (Meitei)', native: 'মৈতৈলোন্ / ꯃꯤꯇꯩꯂꯣꯟ', script: 'ꯈꯨꯔꯨꯝꯖꯔꯤ', region: 'North-East (Manipur)' },
  { code: 'brx-IN', name: 'Bodo', native: 'बर’', script: 'खुलुमबाय', region: 'North-East (Assam / Bodoland)' },
  { code: 'ne-IN', name: 'Nepali', native: 'नेपाली', script: 'नमस्ते', region: 'North-East (Sikkim / Gorkha)' },

  // BRICS Partner Nations (For Global Scalability Pitch)
  { code: 'pt-BR', name: 'Portuguese', native: 'Português', script: 'Olá (BRICS)', region: 'BRICS - Brazil', brics: true },
  { code: 'ru-RU', name: 'Russian', native: 'Русский', script: 'Привет (BRICS)', region: 'BRICS - Russia', brics: true },
  { code: 'zh-CN', name: 'Chinese', native: '中文', script: '你好 (BRICS)', region: 'BRICS - China', brics: true },
  { code: 'zu-ZA', name: 'isiZulu', native: 'isiZulu', script: 'Sawubona (BRICS)', region: 'BRICS - South Africa', brics: true }
];

export const LANGUAGE_REGIONS = [
  { id: 'all', label: 'All Languages (सभी भाषाएँ)' },
  { id: 'popular', label: '⭐ Most Popular' },
  { id: 'north', label: '🏔️ North & Central' },
  { id: 'south', label: '🌴 South India' },
  { id: 'west', label: '🌊 West India' },
  { id: 'east', label: '🌄 East & North-East' },
  { id: 'brics', label: '🌐 BRICS Nations' }
];

// Comprehensive State to District Data Mapping
export const STATES_AND_DISTRICTS = {
  'Maharashtra': ['Pune', 'Mumbai City', 'Mumbai Suburban', 'Nagpur', 'Nashik', 'Chhatrapati Sambhaji Nagar', 'Thane', 'Kolhapur', 'Solapur', 'Amravati', 'Nanded', 'Satara', 'Sangli', 'Ahmednagar', 'Jalgaon', 'Latur', 'Dhule'],
  'Bihar': ['Patna', 'Purnia', 'Gaya', 'Muzaffarpur', 'Bhagalpur', 'Darbhanga', 'Begusarai', 'Katihar', 'Samastipur', 'Nalanda', 'Saharsa', 'Madhubani', 'Rohtas', 'Vaishali', 'Saran', 'Siwan', 'East Champaran'],
  'Uttar Pradesh': ['Lucknow', 'Varanasi', 'Kanpur Nagar', 'Agra', 'Prayagraj', 'Noida (Gautam Buddha Nagar)', 'Ghaziabad', 'Gorakhpur', 'Meerut', 'Bareilly', 'Aligarh', 'Moradabad', 'Ayodhya', 'Jhansi'],
  'Tamil Nadu': ['Chennai', 'Madurai', 'Coimbatore', 'Tiruchirappalli', 'Salem', 'Tirunelveli', 'Erode', 'Vellore', 'Thanjavur', 'Dindigul', 'Kanchipuram', 'Cuddalore', 'Tiruvannamalai'],
  'Karnataka': ['Bengaluru Urban', 'Bengaluru Rural', 'Mysuru', 'Hubballi-Dharwad', 'Mangaluru (Dakshina Kannada)', 'Belagavi', 'Kalaburagi', 'Ballari', 'Shivamogga', 'Tumakuru', 'Udupi', 'Davanagere'],
  'West Bengal': ['Kolkata', 'North 24 Parganas', 'South 24 Parganas', 'Howrah', 'Hooghly', 'Purba Medinipur', 'Darjeeling', 'Siliguri', 'Murshidabad', 'Nadia', 'Paschim Bardhaman'],
  'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar', 'Jamnagar', 'Gandhinagar', 'Junagadh', 'Kutch', 'Anand', 'Mehsana', 'Bharuch'],
  'Andhra Pradesh': ['Visakhapatnam', 'Vijayawada (NTR)', 'Guntur', 'Tirupati', 'Kurnool', 'Nellore', 'Kakinada', 'Kadapa', 'Anantapur', 'Rajahmundry'],
  'Telangana': ['Hyderabad', 'Warangal', 'Nizamabad', 'Karimnagar', 'Khammam', 'Rangareddy', 'Medchal-Malkajgiri', 'Nalgonda', 'Mahabubnagar'],
  'Kerala': ['Thiruvananthapuram', 'Ernakulam (Kochi)', 'Kozhikode', 'Thrissur', 'Kollam', 'Palakkad', 'Kannur', 'Alappuzha', 'Kottayam', 'Malappuram'],
  'Rajasthan': ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota', 'Bikaner', 'Ajmer', 'Bhilwara', 'Alwar', 'Sikar', 'Pali', 'Bharatpur'],
  'Madhya Pradesh': ['Bhopal', 'Indore', 'Gwalior', 'Jabalpur', 'Ujjain', 'Sagar', 'Rewa', 'Satna', 'Ratlam'],
  'Punjab': ['Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala', 'Bathinda', 'Mohali (SAS Nagar)', 'Hoshiarpur', 'Pathankot'],
  'Haryana': ['Gurugram', 'Faridabad', 'Panipat', 'Ambala', 'Karnal', 'Hisar', 'Rohtak', 'Sonipat', 'Panchkula'],
  'Odisha': ['Bhubaneswar (Khurda)', 'Cuttack', 'Rourkela (Sundargarh)', 'Puri', 'Sambalpur', 'Berhampur (Ganjam)', 'Balasore'],
  'Assam': ['Guwahati (Kamrup Metro)', 'Dibrugarh', 'Silchar (Cachar)', 'Jorhat', 'Nagaon', 'Tezpur (Sonitpur)', 'Tinsukia'],
  'Jharkhand': ['Ranchi', 'Jamshedpur (East Singhbhum)', 'Dhanbad', 'Bokaro', 'Hazaribagh', 'Deoghar', 'Giridih'],
  'Chhattisgarh': ['Raipur', 'Bhilai (Durg)', 'Bilaspur', 'Korba', 'Rajnandgaon', 'Jagdalpur (Bastar)'],
  'Uttarakhand': ['Dehradun', 'Haridwar', 'Nainital', 'Rishikesh', 'Udham Singh Nagar', 'Roorkee', 'Almora'],
  'Himachal Pradesh': ['Shimla', 'Dharamshala (Kangra)', 'Mandi', 'Solan', 'Kullu', 'Hamirpur'],
  'Goa': ['North Goa (Panaji)', 'South Goa (Margao)'],
  'Jammu & Kashmir': ['Srinagar', 'Jammu', 'Anantnag', 'Baramulla', 'Udhampur', 'Kathua'],
  'Tripura': ['Agartala (West Tripura)', 'Gomati', 'Dhalai', 'Unakoti'],
  'Meghalaya': ['Shillong (East Khasi Hills)', 'Tura (West Garo Hills)', 'Jowai'],
  'Manipur': ['Imphal West', 'Imphal East', 'Churachandpur', 'Thoubal'],
  'Nagaland': ['Kohima', 'Dimapur', 'Mokokchung'],
  'Mizoram': ['Aizawl', 'Lunglei', 'Champhai'],
  'Sikkim': ['Gangtok', 'Namchi', 'Gyalshing'],
  'Arunachal Pradesh': ['Itanagar (Papum Pare)', 'Tawang', 'Pasighat'],
  'Delhi (NCT)': ['New Delhi', 'Central Delhi', 'South Delhi', 'North Delhi', 'East Delhi', 'West Delhi'],
  'Puducherry': ['Puducherry', 'Karaikal', 'Mahe', 'Yanam'],
  'Chandigarh': ['Chandigarh'],
  'Ladakh': ['Leh', 'Kargil'],
  'BRICS - Brazil': ['São Paulo', 'Rio de Janeiro', 'Brasília', 'Belo Horizonte', 'Salvador'],
  'BRICS - South Africa': ['Johannesburg (Gauteng)', 'Cape Town (Western Cape)', 'Durban (KwaZulu-Natal)', 'Pretoria']
};

// Fast Pincode Auto-Detection Database (Indian Postal System 1st & 2nd digit routing)
export const PINCODE_MAP = {
  '11': { state: 'Delhi (NCT)', district: 'New Delhi', areaType: 'urban' },
  '12': { state: 'Haryana', district: 'Gurugram', areaType: 'urban' },
  '13': { state: 'Haryana', district: 'Ambala', areaType: 'rural' },
  '14': { state: 'Punjab', district: 'Ludhiana', areaType: 'urban' },
  '15': { state: 'Punjab', district: 'Bathinda', areaType: 'rural' },
  '16': { state: 'Chandigarh', district: 'Chandigarh', areaType: 'urban' },
  '17': { state: 'Himachal Pradesh', district: 'Shimla', areaType: 'rural' },
  '18': { state: 'Jammu & Kashmir', district: 'Jammu', areaType: 'urban' },
  '19': { state: 'Jammu & Kashmir', district: 'Srinagar', areaType: 'urban' },
  '20': { state: 'Uttar Pradesh', district: 'Aligarh', areaType: 'rural' },
  '21': { state: 'Uttar Pradesh', district: 'Prayagraj', areaType: 'rural' },
  '22': { state: 'Uttar Pradesh', district: 'Lucknow', areaType: 'urban' },
  '24': { state: 'Uttarakhand', district: 'Dehradun', areaType: 'urban' },
  '28': { state: 'Uttar Pradesh', district: 'Agra', areaType: 'urban' },
  '30': { state: 'Rajasthan', district: 'Jaipur', areaType: 'urban' },
  '31': { state: 'Rajasthan', district: 'Udaipur', areaType: 'rural' },
  '38': { state: 'Gujarat', district: 'Ahmedabad', areaType: 'urban' },
  '39': { state: 'Gujarat', district: 'Surat', areaType: 'urban' },
  '40': { state: 'Maharashtra', district: 'Mumbai City', areaType: 'urban' },
  '41': { state: 'Maharashtra', district: 'Pune', areaType: 'rural' },
  '42': { state: 'Maharashtra', district: 'Nashik', areaType: 'rural' },
  '43': { state: 'Maharashtra', district: 'Chhatrapati Sambhaji Nagar', areaType: 'rural' },
  '44': { state: 'Maharashtra', district: 'Nagpur', areaType: 'urban' },
  '46': { state: 'Madhya Pradesh', district: 'Bhopal', areaType: 'urban' },
  '45': { state: 'Madhya Pradesh', district: 'Indore', areaType: 'urban' },
  '50': { state: 'Telangana', district: 'Hyderabad', areaType: 'urban' },
  '51': { state: 'Andhra Pradesh', district: 'Tirupati', areaType: 'rural' },
  '53': { state: 'Andhra Pradesh', district: 'Visakhapatnam', areaType: 'urban' },
  '56': { state: 'Karnataka', district: 'Bengaluru Urban', areaType: 'urban' },
  '57': { state: 'Karnataka', district: 'Mangaluru (Dakshina Kannada)', areaType: 'rural' },
  '58': { state: 'Karnataka', district: 'Hubballi-Dharwad', areaType: 'rural' },
  '60': { state: 'Tamil Nadu', district: 'Chennai', areaType: 'urban' },
  '62': { state: 'Tamil Nadu', district: 'Madurai', areaType: 'rural' },
  '64': { state: 'Tamil Nadu', district: 'Coimbatore', areaType: 'urban' },
  '67': { state: 'Kerala', district: 'Kozhikode', areaType: 'rural' },
  '68': { state: 'Kerala', district: 'Ernakulam (Kochi)', areaType: 'urban' },
  '69': { state: 'Kerala', district: 'Thiruvananthapuram', areaType: 'urban' },
  '70': { state: 'West Bengal', district: 'Kolkata', areaType: 'urban' },
  '71': { state: 'West Bengal', district: 'Howrah', areaType: 'urban' },
  '72': { state: 'West Bengal', district: 'Purba Medinipur', areaType: 'rural' },
  '73': { state: 'West Bengal', district: 'Siliguri', areaType: 'rural' },
  '75': { state: 'Odisha', district: 'Bhubaneswar (Khurda)', areaType: 'urban' },
  '76': { state: 'Odisha', district: 'Cuttack', areaType: 'rural' },
  '78': { state: 'Assam', district: 'Guwahati (Kamrup Metro)', areaType: 'urban' },
  '79': { state: 'Meghalaya', district: 'Shillong (East Khasi Hills)', areaType: 'rural' },
  '80': { state: 'Bihar', district: 'Patna', areaType: 'urban' },
  '81': { state: 'Bihar', district: 'Bhagalpur', areaType: 'rural' },
  '82': { state: 'Jharkhand', district: 'Ranchi', areaType: 'urban' },
  '84': { state: 'Bihar', district: 'Muzaffarpur', areaType: 'rural' },
  '85': { state: 'Bihar', district: 'Purnia', areaType: 'rural' }
};

// Rich Demo Presets Across India & BRICS for Hackathon Presentation
export const EXPANDED_DEMO_CITIZENS = [
  {
    fullName: 'राकेश कुमार (Rakesh Kumar)',
    mobile: '9876543210',
    email: 'rakesh.kumar@bihar.gov.in',
    state: 'Bihar',
    district: 'Purnia',
    areaType: 'rural',
    tehsil: 'Kasba Block (कस्बा प्रखंड)',
    panchayatOrWard: 'Srinagar Gram Panchayat (श्रीनगर पंचायत)',
    pincode: '854301',
    language: 'hi-IN',
    officialRouting: 'BDO Kasba & DM Purnia',
    povertyIndexFactor: 'High (0.84 - Rural Priority Boost)'
  },
  {
    fullName: 'सचिन पाटील (Sachin Patil)',
    mobile: '9822012345',
    email: 'sachin.patil@pune.gov.in',
    state: 'Maharashtra',
    district: 'Pune',
    areaType: 'rural',
    tehsil: 'Haveli Taluka (हवेली तालुका)',
    panchayatOrWard: 'Wagholi Gram Panchayat (वाघोली)',
    pincode: '412207',
    language: 'mr-IN',
    officialRouting: 'BDO Haveli & Collector Pune',
    povertyIndexFactor: 'Developing (0.52)'
  },
  {
    fullName: 'Meenakshi Sundaram',
    mobile: '9840198765',
    email: 'meenakshi.s@chennaicorp.gov.in',
    state: 'Tamil Nadu',
    district: 'Chennai',
    areaType: 'urban',
    tehsil: 'Mylapore Zone',
    panchayatOrWard: 'Ward No. 124 (Alwarpet)',
    pincode: '600004',
    language: 'ta-IN',
    officialRouting: 'Zonal Officer & Commissioner GCC',
    povertyIndexFactor: 'Urban Baseline (0.28)'
  },
  {
    fullName: 'গৌরব মুখার্জী (Gourab Mukherjee)',
    mobile: '9831098765',
    email: 'gourab.m@kolkata.gov.in',
    state: 'West Bengal',
    district: 'Kolkata',
    areaType: 'urban',
    tehsil: 'Borough VIII',
    panchayatOrWard: 'Ward No. 85 (Ballygunge)',
    pincode: '700019',
    language: 'bn-IN',
    officialRouting: 'Borough Executive & KMC Mayor',
    povertyIndexFactor: 'Urban Baseline (0.31)'
  },
  {
    fullName: 'ਹਰਪ੍ਰੀਤ ਸਿੰਘ (Harpreet Singh)',
    mobile: '9814012345',
    email: 'harpreet.singh@punjab.gov.in',
    state: 'Punjab',
    district: 'Ludhiana',
    areaType: 'rural',
    tehsil: 'Jagraon Block',
    panchayatOrWard: 'Sidhwan Bet Panchayat',
    pincode: '142025',
    language: 'pa-IN',
    officialRouting: 'BDO Jagraon & DC Ludhiana',
    povertyIndexFactor: 'Agricultural Zone (0.45)'
  },
  {
    fullName: 'Carlos Silva (BRICS Demo)',
    mobile: '+55 11 98765-4321',
    email: 'carlos.silva@gov.br',
    state: 'BRICS - Brazil',
    district: 'São Paulo',
    areaType: 'urban',
    tehsil: 'Itaquera Subprefeitura',
    panchayatOrWard: 'Distrito José Bonifácio',
    pincode: '08210-000',
    language: 'pt-BR',
    officialRouting: 'Subprefeito Itaquera & Prefeito SP',
    povertyIndexFactor: 'Developing (0.64)'
  }
];
