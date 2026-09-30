import re
import os

filepath = r"c:\Users\HP\OneDrive\jandhwani local\frontend\src\Map3D.jsx"

with open(filepath, "r", encoding="utf-8") as f:
    content = f.read()

# Replace dummyComplaints and update IndiaMap props
pattern1 = r"const dummyComplaints = \[.*?\];"
content = re.sub(pattern1, "", content, flags=re.DOTALL)

pattern2 = r"function IndiaMap\(\{ onMarkerClick \}\) \{"
content = re.sub(pattern2, "function IndiaMap({ onMarkerClick, complaints = [] }) {", content)

pattern3 = r"dummyComplaints\.map\(complaint => \{"
content = re.sub(pattern3, "complaints.map(complaint => {", content)

# Change boxGeometry to sphereGeometry with size based on urgency, and add pulsating effect.
# Look for the marker mesh block
pattern4 = r"\{/\* Slim Marker \*/\}.*?</mesh>"
new_marker = """{/* Dynamic Red Dot based on urgency */}
            <mesh 
              rotation={[0, 0, 0]} 
              onClick={(e) => { e.stopPropagation(); if(onMarkerClick) onMarkerClick(complaint); }} 
              onPointerOver={(e) => document.body.style.cursor='pointer'} 
              onPointerOut={(e) => document.body.style.cursor='default'}
            >
              <sphereGeometry args={[0.05 * (complaint.urgency || 5), 32, 32]} />
              <meshStandardMaterial 
                color={color} 
                emissive={color} 
                emissiveIntensity={0.8} 
                transparent 
                opacity={0.9}
              />
            </mesh>"""
content = re.sub(pattern4, new_marker, content, flags=re.DOTALL)

# Update Map3D component
pattern5 = r"export default function Map3D\(\{ onMarkerClick \}\) \{"
content = re.sub(pattern5, "export default function Map3D({ onMarkerClick, complaints = [] }) {", content)

pattern6 = r"<IndiaMap onMarkerClick=\{onMarkerClick\} />"
content = re.sub(pattern6, "<IndiaMap onMarkerClick={onMarkerClick} complaints={complaints} />", content)

with open(filepath, "w", encoding="utf-8") as f:
    f.write(content)

print("Updated Map3D.jsx")
