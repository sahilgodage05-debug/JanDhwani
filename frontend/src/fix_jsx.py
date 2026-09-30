import re

filepath = r'c:\Users\HP\OneDrive\jandhwani local\frontend\src\App.jsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

old_start = """      {activeTab === '3d_twin' ? (
        /* STEP 4: 3D DIGITAL TWIN GAMIFIED DASHBOARD (Three.js) */
        <DigitalTwinMap"""

new_start = """      {activeTab === '3d_twin' ? (
        <>
        /* STEP 4: 3D DIGITAL TWIN GAMIFIED DASHBOARD (Three.js) */
        <DigitalTwinMap"""

content = content.replace(old_start, new_start)

old_end = """              />
            </div>
          </div>
      ) : activeTab === 'resolved_archive' ? ("""

new_end = """              />
            </div>
          </div>
        </>
      ) : activeTab === 'resolved_archive' ? ("""

content = content.replace(old_end, new_end)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("JSX fixed!")
