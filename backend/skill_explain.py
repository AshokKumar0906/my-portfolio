import os

import httpx

from data import PROFILE, build_resume_text

GEMINI_MODEL = "gemini-3.5-flash-lite"
GEMINI_URL = (
    f"https://generativelanguage.googleapis.com/v1beta/models/{GEMINI_MODEL}:generateContent"
)


def _system_instruction() -> str:
    return f"""A visitor clicked on one of {PROFILE['name']}'s listed skills and wants to know specifically how he's used it. Answer in 2-3 sentences, citing a real project or role from the résumé below. Speak about him in third person. If the skill isn't clearly evidenced in the résumé, say so briefly rather than inventing detail.

{build_resume_text()}"""


async def explain_skill(skill: str) -> str:
    api_key = os.environ["GOOGLE_GENERATIVE_AI_API_KEY"]
    payload = {
        "contents": [
            {"role": "user", "parts": [{"text": f"Explain how Ashok has used: {skill}"}]}
        ],
        "systemInstruction": {"parts": [{"text": _system_instruction()}]},
        "generationConfig": {"thinkingConfig": {"thinkingLevel": "MINIMAL"}},
    }

    async with httpx.AsyncClient(timeout=30) as client:
        response = await client.post(GEMINI_URL, headers={"x-goog-api-key": api_key}, json=payload)
        response.raise_for_status()
        return response.json()["candidates"][0]["content"]["parts"][0]["text"]
