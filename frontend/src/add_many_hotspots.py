import re

filepath = r"c:\Users\HP\OneDrive\jandhwani local\frontend\src\indiaData.js"

with open(filepath, "r", encoding="utf-8") as f:
    content = f.read()

# I will define 25 highly realistic infrastructure-related hotspots covering various parts of India
new_hotspots_code = """export const DEFAULT_HOTSPOTS = [
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
];"""

# Replace the DEFAULT_HOTSPOTS block
pattern = r"export const DEFAULT_HOTSPOTS = \[.*?\];"
new_content = re.sub(pattern, new_hotspots_code, content, flags=re.DOTALL)

with open(filepath, "w", encoding="utf-8") as f:
    f.write(new_content)

print("Updated DEFAULT_HOTSPOTS in indiaData.js with 20 realistic hotspots")
