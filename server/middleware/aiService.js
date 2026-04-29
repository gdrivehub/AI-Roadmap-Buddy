const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";
const MODEL = "openai/gpt-4o-mini";

/**
 * Generates a structured learning roadmap using OpenRouter AI
 * @param {string} goal - The user's learning goal
 * @returns {Promise<{roadmap: Array, timeline: string, resources: Array}>}
 */
async function generateRoadmap(goal) {
  const prompt = `User goal: ${goal}

Generate a comprehensive, actionable learning roadmap. Return ONLY valid JSON (no markdown, no code blocks, no extra text):
{
  "roadmap": [
    {
      "title": "Phase title",
      "description": "Detailed description of what to learn in this phase",
      "tasks": ["Specific task 1", "Specific task 2", "Specific task 3"]
    }
  ],
  "timeline": "Estimated total timeline e.g. '3-6 months'",
  "resources": [
    {
      "title": "Resource name",
      "url": "https://actual-url.com"
    }
  ]
}

Rules:
- Include 5-8 roadmap phases from beginner to advanced
- Each phase must have 3-5 specific, actionable tasks
- Include 6-10 real, relevant learning resources with valid URLs
- Timeline should be realistic and broken into phases
- Tailor everything specifically to the goal provided`;

  const response = await fetch(OPENROUTER_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": process.env.CLIENT_URL || "http://localhost:3000",
      "X-Title": "AI Learning Roadmap Generator",
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 3000,
      temperature: 0.7,
      messages: [
        {
          role: "system",
          content:
            "You are an expert learning coach and curriculum designer. You create detailed, practical learning roadmaps. Always respond with valid JSON only.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`OpenRouter API error (${response.status}): ${errorBody}`);
  }

  const data = await response.json();

  if (!data.choices || data.choices.length === 0) {
    throw new Error("No response from AI model");
  }

  const rawContent = data.choices[0].message.content.trim();

  // Strip potential markdown code block wrappers
  const cleaned = rawContent
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  let parsed;
  try {
    parsed = JSON.parse(cleaned);
  } catch (e) {
    throw new Error(`Failed to parse AI response as JSON: ${e.message}`);
  }

  if (!parsed.roadmap || !Array.isArray(parsed.roadmap)) {
    throw new Error("Invalid roadmap structure in AI response");
  }

  return parsed;
}

module.exports = { generateRoadmap };
