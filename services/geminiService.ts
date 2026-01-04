import { GoogleGenAI, Type } from "@google/genai";

// Get API key from environment variables with fallback
const getApiKey = (): string => {
  const key = process.env.GEMINI_API_KEY || process.env.API_KEY || '';
  if (!key) {
    console.warn('Warning: GEMINI_API_KEY environment variable is not set');
  }
  return key;
};

// Initialize the Gemini API client
const ai = new GoogleGenAI({ apiKey: getApiKey() });

export const getAIClarification = async (questionText: string) => {
  try {
    const apiKey = getApiKey();
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not configured');
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `Analyze the following college student's career/academic question and provide:
        1. A neutral, clearer version of the question.
        2. A baseline answer with 2-3 possible paths.
        3. 3-5 relevant short tags.
        
        Question: ${questionText}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            neutralQuestion: { type: Type.STRING },
            baselineAnswer: {
              type: Type.OBJECT,
              properties: {
                summary: { type: Type.STRING },
                paths: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ['summary', 'paths']
            },
            suggestedTags: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ['neutralQuestion', 'baselineAnswer', 'suggestedTags']
        }
      }
    });
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini Error:", error);
    return null;
  }
};

export const getThreadSummary = async (question: string, answers: any[]) => {
  try {
    const apiKey = getApiKey();
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not configured');
    }

    const answersText = answers.map((a, i) => `Answer ${i+1}: ${a.shortAnswer}`).join("\n");
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `Provide a TL;DR summary for this career decision thread.
        Question: ${question}
        Answers:
        ${answersText}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            tldr: { type: Type.STRING },
            consensus: { type: Type.STRING },
            differences: { type: Type.STRING }
          },
          required: ['tldr', 'consensus', 'differences']
        }
      }
    });
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini Summary Error:", error);
    return null;
  }
};

export const findSimilarQuestions = async (currentQuestion: string, existingQuestions: string[]) => {
  try {
    const apiKey = getApiKey();
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not configured');
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `Compare this question: "${currentQuestion}" 
      to these existing questions: ${JSON.stringify(existingQuestions)}.
      Return indices of questions that are semantically very similar.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.INTEGER }
        }
      }
    });
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Error finding similar questions:", error);
    return [];
  }
};
