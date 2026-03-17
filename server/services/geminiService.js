import { GoogleGenAI } from "@google/genai";


const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function main(prompt, tone, length, format, language = 'English') {

  const systemPrompt = `
    You are a blog content generator.
    Write in a ${tone} tone.
    Output Language: ${language}.
    Length: ${length}.
    Format: ${format}.
    Topic: ${prompt}.
    Generate plain HTML ONLY (no markdown, no code fences) that can be inserted into a rich text blog editor.
    Format requirements:
    - Use clean HTML tags for structure: <h1>, <h2>, <h3>, <p>, <ul>, <ol>, <li>, <strong>, <em>.
    - You may use HTML <table> tags if presenting tabular data.
    - Do not include any HTML markdown code fences (e.g. \`\`\`html). Just purely the raw HTML content.
    Ensure the content is well-structured, readable, and visually appealing when rendered in a blog.
  `;

  // Call Gemini
  const result = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [{ type: "text", text: systemPrompt }],
  });


  // console.log("Gemini raw response:", JSON.stringify(result, null, 2));
  return result?.candidates?.[0]?.content?.parts?.[0]?.text || "";
}

export default main;
