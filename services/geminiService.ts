import { GoogleGenAI } from "@google/genai";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
};

export const getSpiritualGuidance = async (
  topic: string,
  userContext: string
): Promise<string> => {
  const client = getClient();
  if (!client) return "Connect deeper with your inner self. (API Key missing)";

  try {
    const response = await client.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `You are a wise Vedic sage and mentor for a young man on a 108-day journey of Brahmacharya (celibacy and self-discipline). 
      The user is asking about: "${topic}".
      User Context: ${userContext}.
      
      Provide a short, powerful, and compassionate answer (max 100 words) rooted in Indian philosophy (Yoga, Vedanta) but applicable to modern life. 
      Do not be judgmental. Focus on transmutation of energy (Ojas).`,
    });
    return response.text || "Meditate on your goal. Silence is the answer.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "The path is inward. Try again later.";
  }
};

export const analyzeJournalEntry = async (
  entry: string
): Promise<string> => {
  const client = getClient();
  if (!client) return "Keep reflecting. Your path is valid.";

  try {
    const response = await client.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Analyze this journal entry from a Brahmacharya practitioner: "${entry}".
      Give 1 sentence of encouragement and 1 actionable piece of advice based on stoicism or eastern philosophy. Keep it under 50 words.`,
    });
    return response.text || "Self-reflection is the first step to mastery.";
  } catch (error) {
    return "Journaling clears the mind. Continue your practice.";
  }
};