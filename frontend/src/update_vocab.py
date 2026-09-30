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

translations_file = os.path.join(frontend_dir, 'translations.js')
app_file = os.path.join(frontend_dir, 'App.jsx')
login_file = os.path.join(frontend_dir, 'components', 'login', 'Login.jsx')
map3d_file = os.path.join(frontend_dir, 'Map3D.jsx')

replacements_en = [
    ('Grievance Gateway', 'Development Request Gateway'),
    ('File Grievance', 'File Request'),
    ('fileGrievanceTitle: \'Citizen Grievance Gateway\'', 'fileGrievanceTitle: \'Citizen Development Request Gateway\''),
    ('fileGrievanceSub: \'Lodge your public infrastructure complaints here.\'', 'fileGrievanceSub: \'Lodge your public infrastructure requests here.\''),
    ('yourGrievance: \'Your Grievance\'', 'yourGrievance: \'Your Request\''),
    ('grievancePlaceholder: \'Describe your issue (e.g., Road is broken in sector 4...)\'', 'grievancePlaceholder: \'Describe the development needed (e.g., We need a new water pipeline...)\''),
    ('submitGrievanceBtn: \'Submit Grievance securely via AI\'', 'submitGrievanceBtn: \'Submit Request securely via AI\''),
    ('Live Grievance Map', 'Live Demand Map'),
    ('Grievance Portal', 'Demand Portal'),
    ('grievances.', 'development requests.'),
    ('grievances', 'requests'),
    ('Grievances', 'Requests'),
    ('Grievance', 'Request'),
]

replacements_hi = [
    ('शिकायत', 'विकास अनुरोध'), # Shikayat -> Vikas Anurodh
    ('तक्रार', 'विकास प्रस्ताव'), # Takrar -> Vikas Prastav (Marathi)
    ('குறைதீர்ப்பு', 'வளர்ச்சி கோரிக்கை'), # Tamil
    ('ఫిర్యాదుల', 'అభివృద్ధి అభ్యర్థన'), # Telugu
    ('অভিযোগ', 'উন্নয়ন অনুরোধ'), # Bengali
]

all_replacements = replacements_en + replacements_hi

replace_in_file(translations_file, all_replacements)
replace_in_file(app_file, all_replacements)
replace_in_file(login_file, all_replacements)
replace_in_file(map3d_file, all_replacements)

print("Language updated to Development Request across UI!")
