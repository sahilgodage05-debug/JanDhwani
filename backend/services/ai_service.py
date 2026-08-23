import os
import json
from google.cloud import aiplatform
from vertexai.generative_models import GenerativeModel, Part, SafetySetting, HarmCategory, HarmBlockThreshold

# Mock mode for testing without GCP credentials
MOCK_MODE = os.getenv("MOCK_MODE", "true").lower() == "true"

def extract_complaint_data(text: str) -> dict:
    """
    Analyzes citizen feedback, translates to English if necessary, 
    classifies into a government sector, and assigns a base severity score.
    """
    if MOCK_MODE:
        print(f"[MOCK] AI processing for text: {text}")
        return {
            "category": "Ministry of Jal Shakti",
            "summary": "Mock translated summary of the issue.",
            "base_severity": 8
        }

    # Initialize Vertex AI
    project_id = os.getenv("GCP_PROJECT_ID")
    location = os.getenv("GCP_LOCATION", "us-central1")
    
    if not project_id:
        raise ValueError("GCP_PROJECT_ID environment variable is missing.")

    aiplatform.init(project=project_id, location=location)
    
    # Using Gemini 1.5 Pro
    model = GenerativeModel("gemini-1.5-pro-preview-0409")
    
    prompt = f"""
    You are an expert government data analyst for the JanDhwani platform.
    Analyze the following citizen complaint (which may be in a regional Indian language).
    
    Tasks:
    1. Translate the complaint to English.
    2. Classify the complaint into a strict government sector (e.g., Ministry of Jal Shakti, Ministry of Power, Ministry of Road Transport and Highways, etc.).
    3. Generate a base Severity/Urgency Score between 1 and 10 (10 being most urgent).
    
    Output strictly in the following JSON schema:
    {{
        "category": "String (e.g. Ministry of Jal Shakti)",
        "summary": "String (Brief English summary of the issue)",
        "base_severity": Int (1-10)
    }}
    
    Complaint:
    "{text}"
    """
    
    response = model.generate_content(prompt)
    
    try:
        # Extract JSON from the response text (handling potential markdown formatting)
        result_text = response.text.strip()
        if result_text.startswith("```json"):
            result_text = result_text[7:]
        if result_text.endswith("```"):
            result_text = result_text[:-3]
            
        return json.loads(result_text)
    except json.JSONDecodeError:
        raise ValueError("Failed to parse Gemini response as JSON.")
