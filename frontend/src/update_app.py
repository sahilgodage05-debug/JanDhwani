import re
import os

filepath_india = r"c:\Users\HP\OneDrive\jandhwani local\frontend\src\indiaData.js"

with open(filepath_india, "r", encoding="utf-8") as f:
    content_india = f.read()

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
    citizen: 'Data Aggregated from 1,200 Citizen Voice Reports',
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
    citizen: 'Data Aggregated from 450 SMS/WhatsApp Reports',
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
    citizen: 'Data Aggregated from 800 Field Worker Audio Reports',
    imageVerified: true,
    imageConfidence: 99,
    status: 'Health Task Force Deployed',
    timestamp: '1 hour ago',
    country: 'India'
  },
  {
    id: 'JD-992100',
    title: 'Digital Public Infrastructure (BharatNet) Outage',
    summary: 'Fiber optic cables severed, causing internet blackout across 15 Gram Panchayats. Affects CSC centers and digital payments.',
    department: 'Ministry of Electronics and Information Technology',
    deptKey: 'telecom',
    state: 'Odisha',
    district: 'Kalahandi',
    tehsil: 'Bhawanipatna',
    wardOrPanchayat: 'Lanjigarh',
    landmark: 'Remote Connectivity Zone',
    coords: { x: 0.5, z: 0.5, lat: 19.8251, lng: 83.1610 },
    urgency: 8.9,
    baseUrgency: 7.5,
    povertyBoost: '+1.4 (Digitally Isolated Demographic)',
    areaType: 'Rural (Special Focus Zone)',
    routing: 'Bharat Broadband Network Ltd (BBNL) Nodal Officer',
    citizen: 'Data Aggregated from 300 CSC Operator Tickets',
    imageVerified: true,
    imageConfidence: 92,
    status: 'Cable Splicing Team Dispatched',
    timestamp: '2 hours ago',
    country: 'India'
  },
  {
    id: 'JD-221009',
    title: 'Primary Healthcare Center (Ayushman Arogya Mandir) Non-Functional',
    summary: 'Building dilapidated, no permanent medical officer assigned. Nearest functional hospital is 40km away.',
    department: 'Ministry of Health & Family Welfare',
    deptKey: 'health',
    state: 'Bihar',
    district: 'Purnia',
    tehsil: 'Baisi',
    wardOrPanchayat: 'Baisi Gram Panchayat',
    landmark: 'Flood-Prone Demographic Zone',
    coords: { x: 0.2, z: -0.2, lat: 25.7725, lng: 87.4727 },
    urgency: 9.7,
    baseUrgency: 8.6,
    povertyBoost: '+1.1 (Flood-Prone Health Vulnerability)',
    areaType: 'Rural (Flood Zone)',
    routing: 'Chief Medical Officer & NHM Director',
    citizen: 'Data Aggregated from 2,100 Citizen Voice IVRS Reports',
    imageVerified: true,
    imageConfidence: 95,
    status: 'Mobile Medical Unit (MMU) Diverted',
    timestamp: '45 mins ago',
    country: 'India'
  }
];"""

# Replace the DEFAULT_HOTSPOTS block
pattern = r"export const DEFAULT_HOTSPOTS = \[\];"
content_india = re.sub(pattern, new_hotspots_code, content_india)

with open(filepath_india, "w", encoding="utf-8") as f:
    f.write(content_india)


# Now update App.jsx
filepath_app = r"c:\Users\HP\OneDrive\jandhwani local\frontend\src\App.jsx"
with open(filepath_app, "r", encoding="utf-8") as f:
    content_app = f.read()

# Pass activeComplaints to Map3D
content_app = content_app.replace("<Map3D onMarkerClick", "<Map3D complaints={activeComplaints} onMarkerClick")

# Add Search box and Category states to App.jsx
state_code = """  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');"""
content_app = content_app.replace("const [activeComplaints, setActiveComplaints] = useState(DEFAULT_HOTSPOTS);", 
                                  "const [activeComplaints, setActiveComplaints] = useState(DEFAULT_HOTSPOTS);\n" + state_code)

# Add search and category UI in Gov Dashboard
ui_code = """            <div style={{ display: 'flex', gap: '15px', marginBottom: '25px', flexWrap: 'wrap' }}>
              <input 
                type="text" 
                placeholder="Search by location, issue, or department..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ flex: 1, padding: '12px 20px', borderRadius: '30px', border: '1px solid #ccc', fontSize: '1rem', outline: 'none' }}
              />
              <select 
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                style={{ padding: '12px 20px', borderRadius: '30px', border: '1px solid #ccc', fontSize: '1rem', outline: 'none', background: '#f5f5f5' }}
              >
                <option value="All">All National Projects</option>
                <option value="Jal Shakti">Jal Shakti (Water)</option>
                <option value="Rural Development">Rural Development (Roads/PMGSY)</option>
                <option value="Women and Child">Poshan Abhiyan (WCD)</option>
                <option value="Health">Ayushman Bharat (Health)</option>
                <option value="Information Technology">BharatNet (Telecom/IT)</option>
              </select>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {[...activeComplaints]
                .filter(c => categoryFilter === 'All' || c.department.includes(categoryFilter) || (c.title && c.title.includes(categoryFilter)))
                .filter(c => (c.title && c.title.toLowerCase().includes(searchQuery.toLowerCase())) || (c.summary && c.summary.toLowerCase().includes(searchQuery.toLowerCase())) || (c.location && c.location.toLowerCase().includes(searchQuery.toLowerCase())) || (c.department && c.department.toLowerCase().includes(searchQuery.toLowerCase())))
                .sort((a, b) => b.urgency - a.urgency)
                .map((complaint) => ("""

# Replace in App.jsx
pattern = r"<div style=\{\{ display: 'flex', flexDirection: 'column', gap: '20px' \}\}>\s*\{\[\.\.\.activeComplaints\]\.sort\(\(a, b\) => b\.urgency - a\.urgency\)\.map\(\(complaint\) => \("
content_app = re.sub(pattern, ui_code, content_app, flags=re.DOTALL)

# Handle Firebase synchronization. If Firebase has no complaints, we want the default hotspots to stay!
# Currently `if (data) ... else setActiveComplaints([])`
firebase_update = """      if (data) {
        const complaintsArray = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        
        // Merge Firebase data with DEFAULT_HOTSPOTS based on ID to ensure real-world data always exists
        const mergedMap = new Map();
        DEFAULT_HOTSPOTS.forEach(c => mergedMap.set(c.id, c));
        complaintsArray.filter(c => c.status !== 'Resolved').forEach(c => mergedMap.set(c.id, c));
        
        setActiveComplaints(Array.from(mergedMap.values()));
      } else {
        setActiveComplaints(DEFAULT_HOTSPOTS);
      }"""

# Need to replace the inside of onValue in App.jsx
pattern_firebase = r"if \(data\) \{\s*const complaintsArray = Object\.keys\(data\)\.map\(key => \(\{\s*id: key,\s*\.\.\.data\[key\]\s*\}\)\);\s*setActiveComplaints\(complaintsArray\.filter\(c => c\.status !== 'Resolved'\)\);\s*\} else \{\s*setActiveComplaints\(\[\]\);\s*\}"
content_app = re.sub(pattern_firebase, firebase_update, content_app, flags=re.DOTALL)


with open(filepath_app, "w", encoding="utf-8") as f:
    f.write(content_app)

print("Updated App.jsx with Search, Filter, and Data Merging")
