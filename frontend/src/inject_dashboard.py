import re
import os

filepath = r"c:\Users\HP\OneDrive\jandhwani local\frontend\src\App.jsx"

with open(filepath, "r", encoding="utf-8") as f:
    content = f.read()

dashboard_list_ui = """
          <div className="maps-container">
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
          </div>

          {/* NEW: GOVERNMENT DATA FUSION LIST */}
          <div className="gov-data-dashboard" style={{ marginTop: '30px', background: '#fff', borderRadius: '15px', padding: '25px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' }}>
            <h2 style={{ color: '#1a73e8', borderBottom: '2px solid #eee', paddingBottom: '10px', marginBottom: '20px' }}>
              Data Fusion Triage Engine (Live Demand Hotspots)
            </h2>
            <p style={{ color: '#666', marginBottom: '20px' }}>
              AI-prioritized list fusing real citizen feedback with National Demographic Indices (Poverty, Infrastructure Gaps) to identify extreme necessity zones.
            </p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {[...activeComplaints].sort((a, b) => b.urgency - a.urgency).map((complaint) => (
                <div key={complaint.id} style={{ borderLeft: `6px solid ${complaint.urgency >= 9 ? '#d32f2f' : '#f57c00'}`, background: '#fafafa', padding: '20px', borderRadius: '8px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  
                  {/* Left Column: Core Data */}
                  <div>
                    <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>{complaint.title}</h3>
                    <p style={{ margin: '0 0 15px 0', color: '#555', fontSize: '0.95rem' }}>{complaint.summary}</p>
                    
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '10px' }}>
                      <span style={{ background: '#e3f2fd', color: '#1976d2', padding: '4px 10px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                        {complaint.department}
                      </span>
                      <span style={{ background: '#f3e5f5', color: '#7b1fa2', padding: '4px 10px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                        {complaint.areaType || 'Demographic Zone'}
                      </span>
                      <span style={{ background: '#fff3e0', color: '#e65100', padding: '4px 10px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                        📍 {complaint.tehsil || complaint.district}, {complaint.state}
                      </span>
                    </div>
                  </div>

                  {/* Right Column: AI Analysis & Data Fusion */}
                  <div style={{ background: '#fff', border: '1px solid #e0e0e0', padding: '15px', borderRadius: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                      <span style={{ color: '#666', fontSize: '0.9rem', fontWeight: 'bold' }}>Final AI Priority Score:</span>
                      <span style={{ color: complaint.urgency >= 9 ? '#d32f2f' : '#f57c00', fontSize: '1.2rem', fontWeight: '900' }}>
                        {complaint.urgency} / 10
                      </span>
                    </div>
                    
                    <div style={{ marginBottom: '8px', fontSize: '0.85rem' }}>
                      <strong style={{ color: '#444' }}>Base Severity (Citizen Report):</strong> 
                      <span style={{ float: 'right' }}>{complaint.baseUrgency || 5}</span>
                    </div>
                    <div style={{ marginBottom: '15px', fontSize: '0.85rem' }}>
                      <strong style={{ color: '#444' }}>National DB / Poverty Boost:</strong> 
                      <span style={{ float: 'right', color: '#d32f2f', fontWeight: 'bold' }}>{complaint.povertyBoost || '+0.0'}</span>
                    </div>

                    <div style={{ borderTop: '1px dashed #ccc', paddingTop: '10px', fontSize: '0.85rem', color: '#555' }}>
                      <strong>Recommended Action:</strong> {complaint.routing}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
"""

# Replace just the maps container
pattern = r'<div className="maps-container">.*?</div>\s*</div>'
# Wait, let's look at the exact text to replace. It's from `<div className="maps-container">` to `</>`.
# In App.jsx:
#           <div className="maps-container">
#             <Map3D ... />
#             <div className="google-map-embed-wrapper" ...> ... </div>
#           </div>
#         </>

pattern = r'<div className="maps-container">.*?</>\s*\)\s*:\s*activeTab === \'history\''
new_full_content = dashboard_list_ui + "\n        </>\n\n      ) : activeTab === 'history'"

content = re.sub(pattern, new_full_content, content, flags=re.DOTALL)

with open(filepath, "w", encoding="utf-8") as f:
    f.write(content)

print("Injected Government Dashboard List into App.jsx")
