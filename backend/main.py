import json
import os
from datetime import datetime, timedelta, timezone
from typing import List, Literal

import httpx
from fastapi import FastAPI, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field

from calendar_tool import check_and_book
from data import build_system_prompt
from jd_match import analyze_fit
from skill_explain import explain_skill

app = FastAPI()

GEMINI_MODEL = "gemini-3.5-flash-lite"
GEMINI_STREAM_URL = (
    f"https://generativelanguage.googleapis.com/v1beta/models/{GEMINI_MODEL}"
    ":streamGenerateContent?alt=sse"
)

MAX_TOOL_ROUNDTRIPS = 3

TOOLS = [
    {
        "functionDeclarations": [
            {
                "name": "schedule_call",
                "description": (
                    "Book a call on Ashok's calendar. Only call this after the "
                    "visitor has explicitly confirmed a specific date and time "
                    "that you proposed back to them in a previous message — "
                    "never on the first mention of scheduling."
                ),
                "parameters": {
                    "type": "OBJECT",
                    "properties": {
                        "start_time": {
                            "type": "STRING",
                            "description": "ISO 8601 datetime with +05:30 (IST) offset, e.g. 2026-08-20T14:00:00+05:30",
                        },
                        "end_time": {
                            "type": "STRING",
                            "description": "ISO 8601 datetime with +05:30 (IST) offset",
                        },
                        "visitor_name": {"type": "STRING"},
                        "visitor_email": {
                            "type": "STRING",
                            "description": "Optional; used for the calendar invite if the visitor shared it",
                        },
                        "reason": {
                            "type": "STRING",
                            "description": "One-line reason for the call",
                        },
                    },
                    "required": ["start_time", "end_time", "visitor_name", "reason"],
                },
            }
        ]
    }
]

SCHEDULING_INSTRUCTIONS = """
# Scheduling calls
You can book a call directly on Ashok's calendar using the schedule_call tool. Current date/time: {now} (IST, Asia/Kolkata).

- If a visitor seems interested in talking to Ashok (hiring, collaborating, consulting), proactively offer to schedule a call — don't wait to be asked.
- Never call schedule_call on the first message about scheduling. First propose a specific date/time (within the next 14 days, business hours 9 AM–6 PM IST) and get the visitor's name and reason for the call. Only call the tool after they explicitly confirm that exact time in a follow-up message.
- Ask for the visitor's email if they want a calendar invite, but it's optional.
- If the tool reports a conflict or failure, relay the reason and propose an alternative time — don't retry blindly.
- If the tool succeeds, confirm the booked time back to the visitor.
"""


MAX_MESSAGES = 40
MAX_MESSAGE_LENGTH = 4000


class ChatMessage(BaseModel):
    role: Literal["user", "assistant"]
    content: str = Field(max_length=MAX_MESSAGE_LENGTH)


class ChatRequest(BaseModel):
    # Bounds the request so a single call can't drive unbounded Gemini
    # token cost — a real conversation never gets close to these caps.
    messages: List[ChatMessage] = Field(min_length=1, max_length=MAX_MESSAGES)


def to_gemini_contents(messages: List[ChatMessage]) -> list[dict]:
    return [
        {
            "role": "user" if message.role == "user" else "model",
            "parts": [{"text": message.content}],
        }
        for message in messages
    ]


async def call_tool(name: str, args: dict) -> dict:
    if name == "schedule_call":
        return await check_and_book(
            start_time=args.get("start_time", ""),
            end_time=args.get("end_time", ""),
            visitor_name=args.get("visitor_name") or "a visitor",
            reason=args.get("reason") or "",
            visitor_email=args.get("visitor_email"),
        )
    return {"success": False, "message": f"Unknown tool: {name}"}


def build_system_instruction() -> str:
    now = datetime.now(timezone(timedelta(hours=5, minutes=30))).strftime(
        "%A, %B %d, %Y %I:%M %p"
    )
    return build_system_prompt() + "\n\n" + SCHEDULING_INSTRUCTIONS.format(now=now)


async def stream_chat(messages: List[ChatMessage]):
    api_key = os.environ["GOOGLE_GENERATIVE_AI_API_KEY"]
    contents = to_gemini_contents(messages)
    system_instruction = {"parts": [{"text": build_system_instruction()}]}

    try:
        async with httpx.AsyncClient(timeout=60) as client:
            for _ in range(MAX_TOOL_ROUNDTRIPS):
                payload = {
                    "contents": contents,
                    "systemInstruction": system_instruction,
                    "tools": TOOLS,
                    "generationConfig": {"thinkingConfig": {"thinkingLevel": "MINIMAL"}},
                }

                function_call = None
                thought_signature = None

                async with client.stream(
                    "POST",
                    GEMINI_STREAM_URL,
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
                        for part in parts:
                            if "functionCall" in part:
                                function_call = part["functionCall"]
                                thought_signature = part.get("thoughtSignature")
                            elif part.get("text"):
                                yield f"data: {json.dumps({'delta': part['text']})}\n\n"

                if function_call is None:
                    return  # model gave a final text answer — done

                tool_result = await call_tool(
                    function_call["name"], function_call.get("args", {})
                )

                # Emit the tool's own outcome immediately — the model's
                # follow-up wrap-up text is a nice-to-have, but the visitor
                # must see whether the booking actually succeeded even if
                # that follow-up call is slow or times out.
                if tool_result.get("success"):
                    yield f"data: {json.dumps({'delta': tool_result['message']})}\n\n"

                model_part = {"functionCall": function_call}
                if thought_signature:
                    model_part["thoughtSignature"] = thought_signature
                contents.append({"role": "model", "parts": [model_part]})
                contents.append(
                    {
                        "role": "user",
                        "parts": [
                            {
                                "functionResponse": {
                                    "name": function_call["name"],
                                    "id": function_call.get("id"),
                                    "response": tool_result,
                                }
                            }
                        ],
                    }
                )
                # loop continues so the model can respond given the tool result
    except Exception as error:  # surfaces upstream/timeout failures to the client
        yield f"data: {json.dumps({'error': str(error)})}\n\n"
    finally:
        yield "data: [DONE]\n\n"


@app.post("/api/chat")
async def chat(req: ChatRequest) -> StreamingResponse:
    return StreamingResponse(stream_chat(req.messages), media_type="text/event-stream")


class JdMatchRequest(BaseModel):
    job_description: str = Field(min_length=20, max_length=6000)


@app.post("/api/jd-match")
async def jd_match(req: JdMatchRequest) -> dict:
    try:
        return await analyze_fit(req.job_description)
    except Exception:
        raise HTTPException(status_code=502, detail="Couldn't analyze that job description. Please try again.")


class SkillExplainRequest(BaseModel):
    skill: str = Field(min_length=1, max_length=100)


@app.post("/api/skill-explain")
async def skill_explain(req: SkillExplainRequest) -> dict:
    try:
        explanation = await explain_skill(req.skill)
        return {"explanation": explanation}
    except Exception:
        raise HTTPException(status_code=502, detail="Couldn't fetch an explanation. Please try again.")
