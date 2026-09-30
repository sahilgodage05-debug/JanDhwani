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
  { id: 'all', label: 'All Languages' },
  { id: 'popular', label: 'Most Popular' },
  { id: 'north', label: 'North & Central' },
  { id: 'south', label: 'South India' },
  { id: 'west', label: 'West India' },
  { id: 'east', label: 'East & North-East' },
  { id: 'brics', label: 'BRICS Nations' }
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

// Hierarchical Hotspots covering National, State, District & Precise Hyper-Local Wards
export const DEFAULT_HOTSPOTS = [
  {
    id: 'JD-894101', title: 'Severe Water Crisis (Jal Jeevan Mission Gap)', summary: 'No piped water supply in 4 villages; underground water table depleted.', department: 'Ministry of Jal Shakti', deptKey: 'water', state: 'Uttar Pradesh', district: 'Mahoba', landmark: 'Bundelkhand', coords: { lat: 25.2936, lng: 79.8732 }, urgency: 9.8, baseUrgency: 8.5, povertyBoost: '+1.3', areaType: 'Rural (Aspirational)', routing: 'DM Mahoba', status: 'Pending'
  },
  {
    id: 'JD-332904', title: 'Rural Road Washout (PMGSY Deficit)', summary: 'Monsoon washed away the only unpaved access road. 3 villages cut off.', department: 'Ministry of Rural Development', deptKey: 'roads', state: 'Maharashtra', district: 'Gadchiroli', landmark: 'Forest Tribal Zone', coords: { lat: 19.4184, lng: 80.3168 }, urgency: 9.4, baseUrgency: 8.0, povertyBoost: '+1.4', areaType: 'Rural (Forest Zone)', routing: 'Zilla Parishad CEO', status: 'Action Proposed'
  },
  {
    id: 'JD-554219', title: 'High Malnutrition & Anganwadi Resource Gap', summary: 'Anganwadi center lacks nutritional supplements. High SAM rates detected.', department: 'Ministry of Women and Child Development', deptKey: 'health', state: 'Madhya Pradesh', district: 'Sheopur', landmark: 'Sahariya Settlement', coords: { lat: 25.6667, lng: 76.6950 }, urgency: 9.6, baseUrgency: 8.2, povertyBoost: '+1.4', areaType: 'Rural (Tribal Focus)', routing: 'CDPO', status: 'Health Task Force Deployed'
  },
  {
    id: 'JD-992100', title: 'Digital Public Infrastructure (BharatNet) Outage', summary: 'Fiber optic cables severed, causing internet blackout across 15 GPs.', department: 'Ministry of Electronics & IT', deptKey: 'telecom', state: 'Odisha', district: 'Kalahandi', landmark: 'Remote Connectivity Zone', coords: { lat: 19.8251, lng: 83.1610 }, urgency: 8.9, baseUrgency: 7.5, povertyBoost: '+1.4', areaType: 'Rural', routing: 'BBNL Nodal Officer', status: 'Pending'
  },
  {
    id: 'JD-221009', title: 'Ayushman Arogya Mandir Non-Functional', summary: 'Building dilapidated, no permanent medical officer assigned.', department: 'Ministry of Health', deptKey: 'health', state: 'Bihar', district: 'Purnia', landmark: 'Flood-Prone Zone', coords: { lat: 25.7725, lng: 87.4727 }, urgency: 9.7, baseUrgency: 8.6, povertyBoost: '+1.1', areaType: 'Rural (Flood Zone)', routing: 'CMO', status: 'Mobile Unit Diverted'
  },
  {
    id: 'JD-112233', title: 'Grid Collapse (Deen Dayal Upadhyaya Gram Jyoti Yojana)', summary: 'Substation failure left 20 villages in darkness for 48 hours.', department: 'Ministry of Power', deptKey: 'power', state: 'Jharkhand', district: 'Latehar', landmark: 'LWE Affected Area', coords: { lat: 23.7431, lng: 84.5021 }, urgency: 9.1, baseUrgency: 7.8, povertyBoost: '+1.3', areaType: 'Rural', routing: 'State Electricity Board', status: 'Pending'
  },
  {
    id: 'JD-445566', title: 'Agricultural Produce Market Access Blocked', summary: 'Key bridge collapsed, farmers unable to reach mandi, leading to crop waste.', department: 'Ministry of Agriculture', deptKey: 'agri', state: 'Punjab', district: 'Sangrur', landmark: 'Mandi Access Road', coords: { lat: 30.2458, lng: 75.8421 }, urgency: 7.9, baseUrgency: 7.9, povertyBoost: '+0.0', areaType: 'Semi-Urban', routing: 'PWD Punjab', status: 'Under Review'
  },
  {
    id: 'JD-778899', title: 'Severe Arsenic Contamination in Groundwater', summary: 'Multiple reports of skin lesions. No alternative drinking water source.', department: 'Ministry of Jal Shakti', deptKey: 'water', state: 'West Bengal', district: 'Murshidabad', landmark: 'Ganga Basin', coords: { lat: 24.1759, lng: 88.2802 }, urgency: 10.0, baseUrgency: 9.0, povertyBoost: '+1.0', areaType: 'Rural', routing: 'Water Quality Authority', status: 'Emergency RO Setup'
  },
  {
    id: 'JD-101010', title: 'National Highway (NH-44) Major Landslide', summary: 'Crucial transport corridor blocked by landslide, stalling freight.', department: 'Ministry of Road Transport', deptKey: 'roads', state: 'Jammu and Kashmir', district: 'Ramban', landmark: 'NH-44 Stretch', coords: { lat: 33.2422, lng: 75.1966 }, urgency: 9.5, baseUrgency: 9.0, povertyBoost: '+0.5', areaType: 'Mountainous Highway', routing: 'NHAI', status: 'Clearing Operations Active'
  },
  {
    id: 'JD-202020', title: 'Urban Flooding (Smart City Drainage Failure)', summary: '2 hours of rain caused severe waterlogging in central business district.', department: 'Ministry of Housing & Urban Affairs', deptKey: 'urban', state: 'Karnataka', district: 'Bengaluru', landmark: 'Tech Park Zone', coords: { lat: 12.9716, lng: 77.5946 }, urgency: 8.2, baseUrgency: 8.2, povertyBoost: '+0.0', areaType: 'Metro', routing: 'BBMP', status: 'Pumps Activated'
  },
  {
    id: 'JD-303030', title: 'Govt School Building Unsafe (Samagra Shiksha)', summary: 'Roof collapsed during weekend. 400 students left without classrooms.', department: 'Ministry of Education', deptKey: 'edu', state: 'Rajasthan', district: 'Barmer', landmark: 'Desert Border Area', coords: { lat: 25.7521, lng: 71.3967 }, urgency: 9.3, baseUrgency: 8.5, povertyBoost: '+0.8', areaType: 'Rural', routing: 'District Education Officer', status: 'Pending'
  },
  {
    id: 'JD-404040', title: 'Vaccine Cold Chain Failure', summary: 'Power outage ruined routine immunization stock at rural PHC.', department: 'Ministry of Health', deptKey: 'health', state: 'Assam', district: 'Dhubri', landmark: 'Riverine Area', coords: { lat: 26.0207, lng: 89.9743 }, urgency: 9.9, baseUrgency: 8.7, povertyBoost: '+1.2', areaType: 'Rural (Flood Prone)', routing: 'State Immunization Officer', status: 'Stock Replaced'
  },
  {
    id: 'JD-505050', title: 'Toxic Industrial Effluent in River', summary: 'Factories discharging untreated chemicals into local river affecting fishermen.', department: 'Ministry of Environment', deptKey: 'env', state: 'Gujarat', district: 'Bharuch', landmark: 'Industrial Estate', coords: { lat: 21.7051, lng: 72.9959 }, urgency: 8.8, baseUrgency: 8.5, povertyBoost: '+0.3', areaType: 'Industrial Zone', routing: 'State Pollution Control Board', status: 'Notice Issued'
  },
  {
    id: 'JD-606060', title: 'Lack of Cold Storage Facility (Kisan Sampada)', summary: 'Tomato farmers facing massive distress sales due to lack of cold chain.', department: 'Ministry of Food Processing', deptKey: 'agri', state: 'Andhra Pradesh', district: 'Chittoor', landmark: 'Tomato Belt', coords: { lat: 13.2172, lng: 79.1003 }, urgency: 7.5, baseUrgency: 7.0, povertyBoost: '+0.5', areaType: 'Rural', routing: 'District Agri Officer', status: 'Pending'
  },
  {
    id: 'JD-707070', title: 'Railway Level Crossing Bottleneck', summary: 'Heavy traffic jams at crossing delaying ambulances daily.', department: 'Ministry of Railways', deptKey: 'rail', state: 'Tamil Nadu', district: 'Coimbatore', landmark: 'Urban Outskirts', coords: { lat: 11.0168, lng: 76.9558 }, urgency: 8.0, baseUrgency: 8.0, povertyBoost: '+0.0', areaType: 'Urban', routing: 'Southern Railways DRM', status: 'Overbridge Approved'
  },
  {
    id: 'JD-808080', title: 'Coastal Erosion Threatening Homes', summary: 'Sea advancing rapidly, eroding protective embankments.', department: 'Ministry of Earth Sciences', deptKey: 'env', state: 'Kerala', district: 'Alappuzha', landmark: 'Coastal Belt', coords: { lat: 9.4981, lng: 76.3388 }, urgency: 9.5, baseUrgency: 8.8, povertyBoost: '+0.7', areaType: 'Coastal', routing: 'Disaster Management Authority', status: 'Pending'
  },
  {
    id: 'JD-909090', title: 'Cyber Fraud Epicenter Detected', summary: 'Surge in financial fraud reports originating from specific cellular towers.', department: 'Ministry of Home Affairs', deptKey: 'cyber', state: 'Haryana', district: 'Nuh', landmark: 'Tri-border region', coords: { lat: 28.1065, lng: 77.0195 }, urgency: 8.7, baseUrgency: 8.0, povertyBoost: '+0.7', areaType: 'Rural', routing: 'I4C Cyber Unit', status: 'Task Force Active'
  },
  {
    id: 'JD-123123', title: 'Tribal Hamlet Lacks Connectivity', summary: 'No mobile network in radius of 15km, halting emergency services.', department: 'Ministry of Communications', deptKey: 'telecom', state: 'Chhattisgarh', district: 'Bastar', landmark: 'Deep Forest', coords: { lat: 19.1070, lng: 81.9535 }, urgency: 9.0, baseUrgency: 7.5, povertyBoost: '+1.5', areaType: 'Tribal Zone', routing: 'USOF Nodal Officer', status: 'Pending'
  },
  {
    id: 'JD-456456', title: 'Smog Tower Malfunction (NCAP)', summary: 'Critical air purification infrastructure offline during severe AQI spike.', department: 'Ministry of Environment', deptKey: 'env', state: 'Delhi', district: 'New Delhi', landmark: 'Connaught Place', coords: { lat: 28.6304, lng: 77.2177 }, urgency: 8.4, baseUrgency: 8.4, povertyBoost: '+0.0', areaType: 'Metro', routing: 'CPCB', status: 'Maintenance Deployed'
  },
  {
    id: 'JD-789789', title: 'PDS Ration Shop Biometric Failure', summary: 'PoS machines down for 3 days, daily wage workers unable to get food grain.', department: 'Ministry of Consumer Affairs', deptKey: 'food', state: 'Telangana', district: 'Adilabad', landmark: 'Labor Colony', coords: { lat: 19.6667, lng: 78.5333 }, urgency: 9.6, baseUrgency: 8.5, povertyBoost: '+1.1', areaType: 'Urban Slum', routing: 'Civil Supplies Dept', status: 'Pending'
  }
];

// Initial Resolved Records for Public Audit Ledger
export const INITIAL_RESOLVED_RECORDS = [
  {
    id: 'JD-910401',
    title: 'Substation Transformer Feeder Overload & Sparking',
    department: 'Ministry of Power & State Electricity Distribution',
    deptKey: 'power',
    state: 'Maharashtra',
    district: 'Pune',
    resolvedByRole: 'authority',
    resolvedByName: 'Er. Rajesh Deshmukh',
    officerName: 'Executive Engineer (MSEDCL Pune Zonal Circle)',
    turnaroundTime: 'Resolved in 4 hrs',
    resolutionRemarks: 'Emergency mobile substation transformer deployed and primary 11kV busbar insulator replaced. Power supply normalized.',
    budgetSpent: '₹1.8 Lakhs',
    resolvedAt: '22 Aug 2026, 11:30 AM',
    country: 'India'
  },
  {
    id: 'JD-832104',
    title: 'Arterial Stormwater Drain Choke & Road Flooding',
    department: 'Municipal Solid Waste Management & Sanitation Dept',
    deptKey: 'sanitation_swm',
    state: 'Bihar',
    district: 'Patna',
    resolvedByRole: 'citizen',
    resolvedByName: 'Anand Prakash (Local Resident)',
    turnaroundTime: 'Resolved in 18 hrs',
    rating: 5,
    resolutionRemarks: 'Municipal super-sucker vacuum machine cleared the blocked culvert. Waterlogging completely drained. Thanks for the quick response!',
    resolvedAt: '22 Aug 2026, 09:15 AM',
    country: 'India'
  }
];

export const DISTRICTS_AND_TALUKAS = {
  'Pune': ['Haveli', 'Pune City', 'Baramati', 'Shirur', 'Khed', 'Maval', 'Mulshi', 'Bhor', 'Indapur', 'Daund', 'Purandar', 'Velhe', 'Junnar', 'Ambegaon'],
  'Mumbai City': ['Colaba', 'Byculla', 'Dadar', 'Sion', 'Mahim', 'Malabar Hill'],
  'Mumbai Suburban': ['Andheri', 'Borivali', 'Kurla', 'Bandra', 'Goregaon', 'Malad', 'Kandivali'],
  'Thane': ['Thane', 'Kalyan', 'Murbad', 'Bhiwandi', 'Shahapur', 'Ulhasnagar', 'Ambarnath'],
  'Nashik': ['Nashik', 'Igatpuri', 'Dindori', 'Peint', 'Trimbakeshwar', 'Kalwan', 'Deola', 'Surgana', 'Baglan', 'Malegaon', 'Nandgaon', 'Chandwad', 'Niphad', 'Sinnar', 'Yeola'],
  'Nagpur': ['Nagpur City', 'Nagpur Rural', 'Kamptee', 'Hingna', 'Katol', 'Narkhed', 'Savner', 'Kalameshwar', 'Ramtek', 'Mouda', 'Parseoni', 'Umred', 'Kuhi', 'Bhiwapur'],
  'Patna': ['Patna Sadar', 'Patna City', 'Danapur', 'Barh', 'Masaurhi', 'Paliganj'],
  'Lucknow': ['Lucknow', 'Malihabad', 'Mohanlalganj', 'Bakshi Ka Talab', 'Sarojininagar'],
  'Chennai': ['Alandur', 'Ambattur', 'Aminjikarai', 'Ayanavaram', 'Egmore', 'Guindy', 'Mambalam', 'Mylapore', 'Perambur', 'Purasawalkam', 'Sholinganallur', 'Tondiarpet', 'Velachery'],
  'Bengaluru Urban': ['Bengaluru North', 'Bengaluru South', 'Bengaluru East', 'Anekal', 'Yelahanka'],
  'Kolkata': ['Kolkata'],
  'Ahmedabad': ['Ahmedabad City', 'Daskroi', 'Sanand', 'Bavla', 'Dholka', 'Viramgam', 'Mandal', 'Rampur', 'Detroj', 'Dhandhuka']
};
