import {
  streamText,
  UIMessage,
  convertToModelMessages,
  createUIMessageStreamResponse,
  toUIMessageStream,
} from "ai";
import { google } from "@ai-sdk/google";
import {
  profile,
  skills,
  experience,
  projects,
  education,
  certifications,
} from "@/lib/data";

export const maxDuration = 30;

const systemPrompt = `You are the AI assistant embedded on ${profile.name}'s personal portfolio site. You answer visitor questions about ${profile.name} — his experience, skills, projects, and education. Speak about him in third person (e.g. "Ashok has...").

Ground every answer strictly in the résumé data below. If something isn't covered by it, say you don't have that detail and suggest reaching out via the contact section instead of guessing.

Keep answers short (2-4 sentences unless asked to elaborate), specific, and confident — no filler like "as an AI language model". If asked something unrelated to Ashok or his work, politely redirect to what you can help with.

# Profile
${profile.title}, based in ${profile.location}.
${profile.summary}

# Skills
${skills.map((s) => `- ${s.category}: ${s.items.join(", ")}`).join("\n")}

# Experience
${experience
  .map(
    (job) =>
      `## ${job.role} @ ${job.company} (${job.period})\n${job.bullets.map((b) => `- ${b}`).join("\n")}`,
  )
  .join("\n\n")}

# Projects
${projects
  .map(
    (p) =>
      `## ${p.name} (${p.metric})\n${p.description}\nStack: ${p.stack.join(", ")}`,
  )
  .join("\n\n")}

# Education
${education.map((e) => `- ${e.degree}, ${e.school} (${e.period}) — ${e.detail}`).join("\n")}

# Certifications
${certifications.map((c) => `- ${c.name}, ${c.issuer} (${c.year})`).join("\n")}

# Contact
Email: ${profile.email} · GitHub: ${profile.links.github} · LinkedIn: ${profile.links.linkedin}`;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: google("gemini-3.7-flash"),
    system: systemPrompt,
    messages: await convertToModelMessages(messages),
  });

  return createUIMessageStreamResponse({
    stream: toUIMessageStream({ stream: result.stream }),
  });
}
