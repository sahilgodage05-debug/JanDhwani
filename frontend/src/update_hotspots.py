import re
import os

filepath = r"c:\Users\HP\OneDrive\jandhwani local\frontend\src\indiaData.js"

with open(filepath, "r", encoding="utf-8") as f:
    content = f.read()

new_hotspots_code = """export const DEFAULT_HOTSPOTS = [
  {
    id: 'JD-894101',
    title: 'Severe Water Crisis (Jal Jeevan Mission Gap)',
    summary: 'No piped water supply in 4 villages; underground water table depleted. Acute drinking water shortage reported.',
    department: 'Ministry of Jal Shakti',
    deptKey: 'water',
    state: 'Uttar Pradesh',
    district: 'Mahoba',
    tehsil: 'Kulpahar',
    wardOrPanchayat: 'Sugira Gram Panchayat',
    landmark: 'Bundelkhand Rural Belt',
    coords: { x: 0.8, z: -0.5, lat: 25.2936, lng: 79.8732 },
    urgency: 9.8,
    baseUrgency: 8.5,
    povertyBoost: '+1.3 (Drought-Prone Demographic Vulnerability)',
    areaType: 'Rural (Aspirational District)',
    routing: 'District Magistrate Mahoba & Chief Engineer (Water)',
    citizen: 'Ramakant Tiwari (UID: 945201XXXX)',
    imageVerified: true,
    imageConfidence: 97,
    status: 'Emergency Tankers Dispatched',
    timestamp: '10 mins ago',
    country: 'India'
  },
  {
    id: 'JD-332904',
    title: 'Rural Road Washout (PMGSY Deficit)',
    summary: 'Monsoon washed away the only unpaved access road. 3 villages cut off from nearest PHC and market.',
    department: 'Ministry of Rural Development',
    deptKey: 'roads',
    state: 'Maharashtra',
    district: 'Gadchiroli',
    tehsil: 'Bhamragad',
    wardOrPanchayat: 'Hemalkasa',
    landmark: 'Forest Tribal Zone',
    coords: { x: 0.3, z: 1.2, lat: 19.4184, lng: 80.3168 },
    urgency: 9.4,
    baseUrgency: 8.0,
    povertyBoost: '+1.4 (LWE Affected Tribal Belt)',
    areaType: 'Rural (Forest Zone)',
    routing: 'Zilla Parishad CEO & PWD Executive Engineer',
    citizen: 'Prakash Madavi (UID: 982305XXXX)',
    imageVerified: true,
    imageConfidence: 94,
    status: 'Immediate Bridge Construction Proposed',
    timestamp: '25 mins ago',
    country: 'India'
  },
  {
    id: 'JD-554219',
    title: 'High Malnutrition & Anganwadi Resource Gap',
    summary: 'Anganwadi center lacks nutritional supplements (Poshan Abhiyan) and functional weigh scales for 3 months. High SAM rates detected.',
    department: 'Ministry of Women and Child Development',
    deptKey: 'health',
    state: 'Madhya Pradesh',
    district: 'Sheopur',
    tehsil: 'Vijaypur',
    wardOrPanchayat: 'Karahal',
    landmark: 'Sahariya Tribal Settlement',
    coords: { x: 0.6, z: -0.8, lat: 25.6667, lng: 76.6950 },
    urgency: 9.6,
    baseUrgency: 8.2,
    povertyBoost: '+1.4 (Extreme Nutrition Deficit Area)',
    areaType: 'Rural (Scheduled Tribe Focus)',
    routing: 'CDPO & District Collector (Sheopur)',
    citizen: 'Sunita Bai (UID: 993411XXXX)',
    imageVerified: true,
    imageConfidence: 99,
    status: 'Health Task Force Deployed',
    timestamp: '1 hour ago',
    country: 'India'
  }
];"""

# Replace the DEFAULT_HOTSPOTS block
pattern = r"export const DEFAULT_HOTSPOTS = \[.*?\];"
new_content = re.sub(pattern, new_hotspots_code, content, flags=re.DOTALL)

with open(filepath, "w", encoding="utf-8") as f:
    f.write(new_content)

print("Updated DEFAULT_HOTSPOTS in indiaData.js")
