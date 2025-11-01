import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");

export async function POST(request: Request) {
  try {
    const { userPrompt, action } = await request.json();

    if (!userPrompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    let systemPrompt = "";

    switch (action) {
      case "analyze":
        systemPrompt = `You are a prompt engineering expert. Analyze this prompt and identify what's missing:

User's prompt: "${userPrompt}"

Provide a brief analysis (3-4 sentences) covering:
1. What's currently in the prompt (if anything useful)
2. What's missing (Context, Role, Interview mode, specific Task)
3. How this would perform (likely to get generic results, specific insights, etc.)

Keep it concise and actionable.`;
        break;

      case "improve":
        systemPrompt = `You are a prompt engineering expert who uses the CRIT framework (Context, Role, Interview, Task).

Transform this weak prompt into an expert-level prompt:

Original prompt: "${userPrompt}"

Create an improved version that includes:
- **Context**: Rich background about the situation, goals, and constraints
- **Role**: Assign AI a specific expert identity
- **Interview**: Have AI ask clarifying questions (1-3) before proceeding
- **Task**: Define specific, actionable deliverables

Format the output as a ready-to-use prompt with clear sections. Make it professional and effective.`;
        break;

      case "explain":
        systemPrompt = `You are a prompt engineering teacher. Explain the before/after improvement:

Original prompt: "${userPrompt}"

Explain in simple terms:
1. Why the original prompt would give mediocre results
2. What each improvement adds (Context, Role, Interview, Task)
3. The key principle the user should remember
4. One tip for them to apply this pattern themselves

Use a friendly, teaching tone. Keep it under 200 words.`;
        break;

      default:
        return NextResponse.json(
          { error: "Invalid action" },
          { status: 400 }
        );
    }

    const result = await model.generateContent(systemPrompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ result: text });
  } catch (error) {
    console.error("Gemini API Error:", error);
    return NextResponse.json(
      { error: "Failed to process prompt" },
      { status: 500 }
    );
  }
}
