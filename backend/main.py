import os
from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from pydantic import BaseModel
from typing import Optional
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware

# Load environment variables
load_dotenv()

# Import services
from services.ai_service import extract_complaint_data
from services.audio_service import transcribe_audio
from services.data_fusion import get_final_priority_score
from services.firebase_service import push_to_firebase

app = FastAPI(title="JanDhwani 3D Digital Twin API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ComplaintResponse(BaseModel):
    id: str
    category: str
    summary: str
    base_severity: int
    final_priority_score: float
    district: str
    lat: float
    lng: float

@app.get("/health")
def health_check():
    return {"status": "healthy"}

@app.post("/api/complaints", response_model=ComplaintResponse)
async def process_complaint(
    text: Optional[str] = Form(None),
    audio: Optional[UploadFile] = File(None),
    district: str = Form(...),
    lat: float = Form(...),
    lng: float = Form(...)
):
    """
    Process a citizen complaint (text or audio), extract structured data,
    calculate priority, and push to the 3D map.
    """
    if not text and not audio:
        raise HTTPException(status_code=400, detail="Must provide either text or audio.")

    complaint_text = text

    # 1. Audio Processing (if provided)
    if audio:
        audio_bytes = await audio.read()
        try:
            complaint_text = transcribe_audio(audio_bytes)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Audio transcription failed: {str(e)}")

    # 2. AI Structured Extraction
    try:
        ai_result = extract_complaint_data(complaint_text)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI extraction failed: {str(e)}")

    # 3. Data Fusion (BigQuery)
    try:
        final_score = get_final_priority_score(district, ai_result["base_severity"])
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Data fusion failed: {str(e)}")

    # 4. Real-time Broadcast (Firebase)
    payload = {
        "category": ai_result["category"],
        "summary": ai_result["summary"],
        "base_severity": ai_result["base_severity"],
        "final_priority_score": final_score,
        "district": district,
        "lat": lat,
        "lng": lng,
        "original_text": complaint_text
    }
    
    try:
        firebase_id = push_to_firebase(payload)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Firebase push failed: {str(e)}")

    return ComplaintResponse(
        id=firebase_id,
        category=ai_result["category"],
        summary=ai_result["summary"],
        base_severity=ai_result["base_severity"],
        final_priority_score=final_score,
        district=district,
        lat=lat,
        lng=lng
    )
