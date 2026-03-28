import { GoogleGenAI } from "@google/genai";
import dotenv from 'dotenv'
dotenv.config()
const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

export const generateQuizQuestions = async (
    topic,
    difficulty = "medium",
    numberOfQuestions = 10
) => {

    const prompt = `
Generate ${numberOfQuestions} multiple choice questions about "${topic}".

Difficulty: ${difficulty}

Return ONLY valid JSON in this format:

[
 {
   "questionText": "Question here",
   "options": ["Option A", "Option B", "Option C", "Option D"],
   "correctAnswer": "Option A",
   "difficulty": "${difficulty}"
 }
]

Rules:
- exactly 4 options
- correctAnswer must match one option
- no explanations
- JSON only
`;

    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt
    });

    const text = response.text;

    let questions;

    try {
        questions = JSON.parse(text);
    } catch (err) {
        throw new Error("AI returned invalid JSON");
    }

    return questions;
};