import os
from datetime import datetime, timedelta, timezone
from typing import Optional

import httpx

TOKEN_URL = "https://oauth2.googleapis.com/token"
CALENDAR_ID = "primary"
BOOKING_MARKER = "Booked via portfolio AI assistant"
MAX_BOOKINGS_PER_HOUR = 3
IST = timezone(timedelta(hours=5, minutes=30))


async def _get_access_token(client: httpx.AsyncClient) -> str:
    response = await client.post(
        TOKEN_URL,
        data={
            "client_id": os.environ["GOOGLE_CALENDAR_CLIENT_ID"],
            "client_secret": os.environ["GOOGLE_CALENDAR_CLIENT_SECRET"],
            "refresh_token": os.environ["GOOGLE_CALENDAR_REFRESH_TOKEN"],
            "grant_type": "refresh_token",
        },
    )
    response.raise_for_status()
    return response.json()["access_token"]


def _parse(iso_value: str) -> datetime:
    return datetime.fromisoformat(iso_value)


def _validate_slot(start: datetime, end: datetime) -> Optional[str]:
    if start.utcoffset() != timedelta(hours=5, minutes=30):
        return "Times must be given in India Standard Time (+05:30 offset)."
    if end <= start:
        return "End time must be after start time."
    if end - start > timedelta(hours=2):
        return "Calls can be at most 2 hours long."

    now = datetime.now(IST)
    if start <= now:
        return "That time is in the past — please suggest a future slot."
    if start > now + timedelta(days=14):
        return "Please pick a time within the next 14 days."
    if not (9 <= start.hour < 18) or end.hour > 18 or (end.hour == 18 and end.minute > 0):
        return "Please pick a time between 9 AM and 6 PM IST."
    return None


async def check_and_book(
    start_time: str,
    end_time: str,
    visitor_name: str,
    reason: str,
    visitor_email: Optional[str] = None,
) -> dict:
    try:
        start = _parse(start_time)
        end = _parse(end_time)
    except ValueError:
        return {
            "success": False,
            "message": "Invalid date/time format — use ISO 8601 with a +05:30 offset.",
        }

    error = _validate_slot(start, end)
    if error:
        return {"success": False, "message": error}

    async with httpx.AsyncClient(timeout=15) as client:
        access_token = await _get_access_token(client)
        headers = {"Authorization": f"Bearer {access_token}"}

        window_start = datetime.now(timezone.utc) - timedelta(hours=1)
        recent = await client.get(
            f"https://www.googleapis.com/calendar/v3/calendars/{CALENDAR_ID}/events",
            headers=headers,
            params={
                # updatedMin filters by last-modified time, not occurrence time —
                # bookings are usually for a future slot, so timeMin/timeMax
                # (which filter by when the event *happens*) would miss them.
                "updatedMin": window_start.isoformat(),
                "q": BOOKING_MARKER,
                "singleEvents": "true",
            },
        )
        recent.raise_for_status()
        if len(recent.json().get("items", [])) >= MAX_BOOKINGS_PER_HOUR:
            return {
                "success": False,
                "message": (
                    "Too many booking requests have come in recently — please "
                    "try again in a bit, or reach out by email directly."
                ),
            }

        freebusy = await client.post(
            "https://www.googleapis.com/calendar/v3/freeBusy",
            headers=headers,
            json={
                "timeMin": start.isoformat(),
                "timeMax": end.isoformat(),
                "items": [{"id": CALENDAR_ID}],
            },
        )
        freebusy.raise_for_status()
        busy = freebusy.json()["calendars"][CALENDAR_ID]["busy"]
        if busy:
            conflict = busy[0]
            return {
                "success": False,
                "message": (
                    f"That slot conflicts with an existing event "
                    f"({conflict['start']} to {conflict['end']}). "
                    "Please suggest a different time."
                ),
            }

        event = {
            "summary": f"Call with {visitor_name} (via portfolio AI)",
            "description": f"{BOOKING_MARKER}\nRequested by: {visitor_name}\nReason: {reason}",
            "start": {"dateTime": start.isoformat()},
            "end": {"dateTime": end.isoformat()},
        }
        if visitor_email:
            event["attendees"] = [{"email": visitor_email}]

        created = await client.post(
            f"https://www.googleapis.com/calendar/v3/calendars/{CALENDAR_ID}/events",
            headers=headers,
            params={"sendUpdates": "all"},
            json=event,
        )
        created.raise_for_status()

        return {
            "success": True,
            "message": f"Booked for {start.strftime('%A, %B %d at %I:%M %p')} IST.",
            "event_link": created.json().get("htmlLink"),
        }
