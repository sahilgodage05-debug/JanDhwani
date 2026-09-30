import re

filepath = r'c:\Users\HP\OneDrive\jandhwani local\frontend\src\App.jsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Remove DigitalTwinMap from render
digital_twin_chunk = """        /* STEP 4: 3D DIGITAL TWIN GAMIFIED DASHBOARD (Three.js) */
        <DigitalTwinMap 
          hotspots={activeComplaints}
          onClearAllComplaints={handleClearAllComplaints}
          onRestoreDemo={handleRestoreDemoHotspots}
          onResolveCitizen={handleResolveByCitizen}
          onResolveAuthority={handleResolveByAuthority}
          onViewArchive={() => setActiveTab('resolved_archive')}
          onBackToPortal={() => setActiveTab('grievance')}
          currentUser={currentUser}
        />"""

content = content.replace(digital_twin_chunk, "")

# 2. Rename the tab button from "3D Digital Twin Map" to "Live Grievance Map"
nav_old = """              <button 
                type="button"
                className={`nav-btn ${activeTab === '3d_twin' ? 'active' : ''}`}
                onClick={() => setActiveTab('3d_twin')}
              >
                3D Digital Twin Map
              </button>"""

nav_new = """              <button 
                type="button"
                className={`nav-btn ${activeTab === '3d_twin' ? 'active' : ''}`}
                onClick={() => setActiveTab('3d_twin')}
              >
                Live Grievance Map
              </button>"""

content = content.replace(nav_old, nav_new)

# 3. Remove "Resolved Archive" button
resolved_nav_btn = """              <button 
                type="button"
                className={`nav-btn ${activeTab === 'resolved_archive' ? 'active' : ''}`}
                onClick={() => setActiveTab('resolved_archive')}
              >
                Resolved Archive
              </button>"""

content = content.replace(resolved_nav_btn, "")

# 4. Remove Resolved Archive conditional render
resolved_render = """      ) : activeTab === 'resolved_archive' ? (
        /* RESOLVED ISSUES ARCHIVE & RECORDS LEDGER */
        <ResolvedArchive 
          records={resolvedRecords}
          onClearArchive={handleClearResolvedArchive}
          onDeleteRecord={handleDeleteResolvedRecord}
          onBackToMap={() => setActiveTab('3d_twin')}
          onBackToPortal={() => setActiveTab('grievance')}
          activeLanguage={selectedLanguage}
        />"""

content = content.replace(resolved_render, "")

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("DigitalTwinMap and Resolved Archive removed!")
