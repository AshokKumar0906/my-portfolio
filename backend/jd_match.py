import json
import os

import httpx

from data import PROFILE, build_resume_text

GEMINI_MODEL = "gemini-3.5-flash-lite"
GEMINI_URL = (
    f"https://generativelanguage.googleapis.com/v1beta/models/{GEMINI_MODEL}:generateContent"
)

RESPONSE_SCHEMA = {
    "type": "OBJECT",
    "properties": {
        "score": {"type": "INTEGER", "description": "Fit score from 0-100"},
        "verdict": {"type": "STRING", "description": "One-sentence overall verdict"},
        "matches": {
            "type": "ARRAY",
            "items": {"type": "STRING"},
            "description": "Specific matching experience/skills, citing real projects by name",
        },
        "gaps": {
            "type": "ARRAY",
            "items": {"type": "STRING"},
            "description": "Genuine gaps versus the job description, if any",
        },
    },
    "required": ["score", "verdict", "matches", "gaps"],
}


def _system_instruction() -> str:
    return f"""You are evaluating how well {PROFILE['name']} fits a job description, based strictly on his résumé below. Be honest and specific: cite real projects or experience for each match, and call out genuine gaps rather than glossing over them for the sake of being flattering. Do not inflate the score. If the pasted text isn't actually a job description, say so in the verdict and score it 0.

{build_resume_text()}"""


async def analyze_fit(job_description: str) -> dict:
    api_key = os.environ["GOOGLE_GENERATIVE_AI_API_KEY"]
    payload = {
        "contents": [
            {"role": "user", "parts": [{"text": f"Job description:\n\n{job_description}"}]}
        ],
        "systemInstruction": {"parts": [{"text": _system_instruction()}]},
        "generationConfig": {
            "responseMimeType": "application/json",
            "responseSchema": RESPONSE_SCHEMA,
            "thinkingConfig": {"thinkingLevel": "MINIMAL"},
        },
    }

    async with httpx.AsyncClient(timeout=45) as client:
        response = await client.post(GEMINI_URL, headers={"x-goog-api-key": api_key}, json=payload)
        response.raise_for_status()
        text = response.json()["candidates"][0]["content"]["parts"][0]["text"]
        return json.loads(text)
