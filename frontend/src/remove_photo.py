import re

filepath = r'c:\Users\HP\OneDrive\jandhwani local\frontend\src\App.jsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# I will use a regex to replace everything from `<div className="form-group">\n                <div className="evidence-header-row">`
# to `{/* Location Confirmation Section */}`

pattern = r'<div className="form-group">\s*<div className="evidence-header-row">.*?\{/\* Location Confirmation Section \*/\}'
replacement = '{/* Location Confirmation Section */}'

new_content = re.sub(pattern, replacement, content, flags=re.DOTALL)

# Also remove the `{/* Contextual Photo Location Feedback */}` block
pattern2 = r'\{/\* Contextual Photo Location Feedback \*/\}.*?</div>\s*\}\)'
# Wait, it's safer to just search exactly the block
photo_feedback = """                {/* Contextual Photo Location Feedback */}
                {imageFile && (
                  <div className={`loc-photo-badge ${isLivePhoto ? 'live' : 'gallery'}`} style={{
                    padding: '8px 12px',
                    borderRadius: '8px',
                    marginBottom: '15px',
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    backgroundColor: isLivePhoto ? '#e8f5e9' : '#fff3e0',
                    color: isLivePhoto ? '#2e7d32' : '#e65100',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    {isLivePhoto ? (
                      <>✅ Live GPS Location Attached via Camera</>
                    ) : (
                      <>⚠️ Please confirm the manual location for this old gallery photo.</>
                    )}
                  </div>
                )}"""

new_content = new_content.replace(photo_feedback, "")

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(new_content)
print("Photo Evidence feature removed!")
