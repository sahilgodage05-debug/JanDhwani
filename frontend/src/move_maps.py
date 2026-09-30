import re

filepath = r'c:\Users\HP\OneDrive\jandhwani local\frontend\src\App.jsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# The maps container chunk we want to extract and move
maps_chunk = """          <div className="maps-container">
            <Map3D onMarkerClick={(complaint) => setSelected3DMarkerLocation(complaint.coords && complaint.coords.lat && complaint.coords.lng ? `${complaint.coords.lat},${complaint.coords.lng}` : `${complaint.title}, ${complaint.location}`)} />
            <div className="google-map-embed-wrapper" style={{background: '#fff', borderRadius: '20px', padding: '10px', boxShadow: '0 15px 35px rgba(0,0,0,0.1)'}}>
              <div className="map-embed-header" style={{marginBottom: '10px', display: 'flex', justifyContent: 'space-between', padding: '0 10px'}}>
                <span style={{color: '#3e2723', fontWeight: 'bold'}}>Real-time Satellite Mapping (Syncs with 3D Map)</span>
                <a 
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selected3DMarkerLocation || 'India Gate, Delhi')}`}
                  target="_blank" 
                  rel="noreferrer"
                  className="open-gmaps-link"
                >
                  Open in Google Maps ➔
                </a>
              </div>
              <iframe
                title="Google Map Location Preview"
                className="google-map-iframe"
                src={`https://maps.google.com/maps?q=${encodeURIComponent(selected3DMarkerLocation || 'India Gate, Delhi')}&t=m&z=14&ie=UTF8&iwloc=&output=embed`}
                loading="lazy"
                style={{width: '100%', height: '500px', border: 'none', borderRadius: '15px'}}
              />
            </div>
          </div>"""

# Remove the maps chunk from its current location
if maps_chunk in content:
    content = content.replace(maps_chunk, "")
else:
    print("Warning: Could not find maps chunk exactly as formatted.")

# Add it below DigitalTwinMap
twin_target = """        <DigitalTwinMap 
          hotspots={activeComplaints}
          onClearAllComplaints={handleClearAllComplaints}
          onRestoreDemo={handleRestoreDemoHotspots}
          onResolveCitizen={handleResolveByCitizen}
          onResolveAuthority={handleResolveByAuthority}
          onViewArchive={() => setActiveTab('resolved_archive')}
          onBackToPortal={() => setActiveTab('grievance')}
          currentUser={currentUser}
        />"""

new_twin = twin_target + "\n\n" + maps_chunk

if twin_target in content:
    content = content.replace(twin_target, new_twin)
else:
    print("Warning: Could not find DigitalTwinMap chunk exactly as formatted.")

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print("Moved maps container successfully.")
