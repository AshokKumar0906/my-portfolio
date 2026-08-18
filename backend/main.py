import json
import os
from typing import List, Literal

import httpx
from fastapi import FastAPI
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

from data import build_system_prompt

app = FastAPI()

GEMINI_MODEL = "gemini-3.5-flash-lite"
GEMINI_URL = (
    f"https://generativelanguage.googleapis.com/v1beta/models/{GEMINI_MODEL}"
    ":streamGenerateContent?alt=sse"
)


class ChatMessage(BaseModel):
    role: Literal["user", "assistant"]
    content: str


class ChatRequest(BaseModel):
    messages: List[ChatMessage]


def to_gemini_contents(messages: List[ChatMessage]) -> list[dict]:
    return [
        {
            "role": "user" if message.role == "user" else "model",
            "parts": [{"text": message.content}],
        }
        for message in messages
    ]


async def stream_chat(messages: List[ChatMessage]):
    api_key = os.environ["GOOGLE_GENERATIVE_AI_API_KEY"]
    payload = {
        "contents": to_gemini_contents(messages),
        "systemInstruction": {"parts": [{"text": build_system_prompt()}]},
        "generationConfig": {"thinkingConfig": {"thinkingLevel": "MINIMAL"}},
    }

    try:
        async with httpx.AsyncClient(timeout=25) as client:
            async with client.stream(
                "POST",
                GEMINI_URL,
                headers={"x-goog-api-key": api_key},
                json=payload,
            ) as response:
                if response.status_code != 200:
                    body = (await response.aread()).decode()
                    yield f"data: {json.dumps({'error': body})}\n\n"
                    return

                async for line in response.aiter_lines():
                    if not line.startswith("data: "):
                        continue
                    chunk = json.loads(line[len("data: "):])
                    parts = (
                        chunk.get("candidates", [{}])[0]
                        .get("content", {})
                        .get("parts", [])
                    )
                    text = "".join(part.get("text", "") for part in parts)
                    if text:
                        yield f"data: {json.dumps({'delta': text})}\n\n"
    except Exception as error:  # surfaces upstream/timeout failures to the client
        yield f"data: {json.dumps({'error': str(error)})}\n\n"
    finally:
        yield "data: [DONE]\n\n"


@app.post("/api/chat")
async def chat(req: ChatRequest) -> StreamingResponse:
    return StreamingResponse(stream_chat(req.messages), media_type="text/event-stream")
