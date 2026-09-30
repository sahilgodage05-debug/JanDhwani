import os

def replace_in_file(filepath, replacements):
    if not os.path.exists(filepath):
        return
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    for old_str, new_str in replacements:
        content = content.replace(old_str, new_str)
        
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

frontend_dir = r"c:\Users\HP\OneDrive\jandhwani local\frontend\src"
app_file = os.path.join(frontend_dir, 'App.jsx')
translations_file = os.path.join(frontend_dir, 'translations.js')

replacements_app = [
    ('Problem Decomposition & Executive Synthesis', 'Data Fusion & Priority Assessment'),
    ('Executive Summary for Administrative Decision Makers:', 'Demand Hotspot Executive Summary:'),
    ('Core Infrastructure Defect', 'Primary Infrastructure Gap'),
    ('Impacted Population & Scope', 'Demographic Vulnerability Index'),
    ('Risk & Hazard Analysis', 'Public Investment Priority'),
    ('Reported Inaction Duration', 'Citizen Feedback Frequency'),
    ('Prescribed Administrative Action', 'Recommended Development Project'),
    ('Urgency Score:', 'Final Priority Score (Data Fusion):')
]

replacements_translations = [
    ('Synced to National Data Grid • 3D Beacon Generated', 'Synced to National Infrastructure Data Grid • 3D Demand Hotspot Plotted')
]

replace_in_file(app_file, replacements_app)
replace_in_file(translations_file, replacements_translations)

print("AI Analysis block and synced banner updated to match Problem Statement!")
