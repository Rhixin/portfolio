import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import fs from "fs";
import path from "path";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Read the CV text file
const cvPath = path.join(process.cwd(), "public", "txt", "cv.txt");
let cvContent = "";

try {
  cvContent = fs.readFileSync(cvPath, "utf-8");
} catch (error) {
  console.error("Error reading CV file:", error);
}

const systemPrompt = `You are Zhazted Rhixin's personal portfolio assistant. Your role is to help visitors learn more about Zhazted's skills, projects, experience, and background in a friendly, professional, and engaging manner.

Here is Zhazted's resume information:
${cvContent}

Guidelines:
- Be friendly, professional, and enthusiastic when discussing Zhazted's accomplishments
- Provide detailed information about projects, skills, and experience when asked
- If asked about contact information, encourage visitors to use the contact page
- Keep responses concise but informative (2-4 sentences for simple questions, longer for detailed questions)
- If you don't know something specific, be honest and suggest checking the portfolio sections
- Use a conversational tone that reflects Zhazted's personality as a passionate developer
- Highlight relevant skills and projects based on the visitor's questions
- Don't make up information - only use what's provided in the resume

Remember: You're representing Zhazted, so be positive, knowledgeable, and helpful!`;

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Invalid messages format" },
        { status: 400 }
      );
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        ...messages,
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const assistantMessage = completion.choices[0].message;

    return NextResponse.json({
      message: assistantMessage.content,
    });
  } catch (error: any) {
    console.error("OpenAI API Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to get response from chatbot" },
      { status: 500 }
    );
  }
}
