import { GoogleGenAI } from "@google/genai";


const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function main(prompt, tone, length, format, language = 'English') {

  const systemPrompt = `
    You are a professional SEO expert and blog content generator.
    Write in a ${tone} tone.
    Output Language: ${language}.
    Length: ${length}.
    Format: ${format}.
    Topic: ${prompt}.
    
    CRITICAL SEO & QUALITY REQUIREMENTS:
    1. Write a highly engaging, click-worthy <h1> title.
    2. Hook the reader immediately in the first paragraph.
    3. Naturally integrate semantic keywords related to the Topic throughout the text without keyword stuffing.
    4. Structure the content logically with clear <h2> and <h3> subheadings to make it scannable for both readers and search engine crawlers.
    5. Use short paragraphs, bullet points (<ul>, <li>), and bold text (<strong>) to emphasize key takeaways and improve readability.
    6. Ensure the conclusion summarizes the value provided and encourages reader engagement.
    
    TECHNICAL FORMAT REQUIREMENTS:
    - Generate plain HTML ONLY (no markdown, no code fences) that can be inserted directly into a rich text blog editor. 
    - Use clean HTML tags for structure: <h1>, <h2>, <h3>, <p>, <ul>, <ol>, <li>, <strong>, <em>.
    - You may use HTML <table> tags if presenting tabular data.
    - Do absolutely NOT include any HTML markdown code fences (e.g. \`\`\`html) around your response. Just purely the raw HTML content.
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
