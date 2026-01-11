import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { CHAT_SYSTEM_INSTRUCTION } from "../constants";

// Helper to create a new instance to ensure latest API key is used
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const createChatSession = (useThinking: boolean = false): Chat => {
  const ai = getAI();
  return ai.chats.create({
    model: useThinking ? 'gemini-3-pro-preview' : 'gemini-3-flash-preview',
    config: {
      systemInstruction: CHAT_SYSTEM_INSTRUCTION,
      temperature: 0.8,
      ...(useThinking ? { thinkingConfig: { thinkingBudget: 32768 } } : {})
    },
  });
};

export const sendMessageStream = async (
  chat: Chat, 
  message: string
): Promise<AsyncIterable<GenerateContentResponse>> => {
  return await chat.sendMessageStream({ message });
};

export const analyzeProjectIdea = async (description: string): Promise<string> => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analyze this hackathon project idea for a Stranger Things themed event: "${description}". Give a short, snarky critique in the style of the Mind Flayer or a skeptical Hawkins scientist. Max 2 sentences. Mention the Upside Down or Demogorgons.`,
    });
    return response.text || "The void remains silent. Proceed with caution.";
  } catch (error) {
    console.error("Analysis failed:", error);
    return "The rift is too unstable for analysis. Trust your gut.";
  }
};

/**
 * Image Generation with Gemini 3 Pro Image
 */
export const generateImagePro = async (
  prompt: string, 
  imageSize: "1K" | "2K" | "4K" = "1K",
  aspectRatio: "1:1" | "2:3" | "3:2" | "3:4" | "4:3" | "9:16" | "16:9" | "21:9" = "16:9"
): Promise<string | null> => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: {
        parts: [
          {
            text: `${prompt}, in the style of Stranger Things, 80s retro horror aesthetic, dark atmosphere, neon red and blue lighting, cinematic, film grain, high quality`,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio,
          imageSize
        },
      },
    });

    const candidate = response.candidates?.[0];
    if (candidate?.content?.parts) {
      for (const part of candidate.content.parts) {
        if (part.inlineData) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
    }
    return null;
  } catch (error) {
    console.error("Image generation failed:", error);
    throw error;
  }
};

/**
 * Video Generation with Veo 3
 */
export const generateVideo = async (
  prompt: string,
  aspectRatio: "16:9" | "9:16" = "16:9",
  resolution: "720p" | "1080p" = "720p"
): Promise<string | null> => {
  try {
    const ai = getAI();
    let operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: `${prompt}, in the style of Stranger Things, 80s aesthetic, retro horror, cinematic lighting, VHS grain`,
      config: {
        numberOfVideos: 1,
        resolution,
        aspectRatio
      }
    });

    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 10000));
      operation = await ai.operations.getVideosOperation({ operation });
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (downloadLink) {
      const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
      const blob = await response.blob();
      return URL.createObjectURL(blob);
    }
    return null;
  } catch (error) {
    console.error("Video generation failed:", error);
    throw error;
  }
};

/**
 * Image Editing with Gemini 2.5 Flash Image
 */
export const editImage = async (base64Image: string, prompt: string, mimeType: string): Promise<string | null> => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Image.split(',')[1] || base64Image,
              mimeType: mimeType,
            },
          },
          {
            text: prompt,
          },
        ],
      },
    });

    const candidate = response.candidates?.[0];
    if (candidate?.content?.parts) {
      for (const part of candidate.content.parts) {
        if (part.inlineData) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
    }
    return null;
  } catch (error) {
    console.error("Image edit failed:", error);
    throw error;
  }
};

/**
 * Media Analysis (Image/Video) with Gemini 3 Pro + Thinking
 */
export const analyzeMedia = async (
  base64Data: string, 
  mimeType: string, 
  prompt: string, 
  useThinking: boolean = true
): Promise<string> => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Data.split(',')[1] || base64Data,
              mimeType: mimeType,
            },
          },
          { text: prompt },
        ],
      },
      config: {
        ...(useThinking ? { thinkingConfig: { thinkingBudget: 32768 } } : {})
      }
    });
    return response.text || "No signal received from the artifact.";
  } catch (error) {
    console.error("Analysis failed:", error);
    return "Error processing transmission: " + error.message;
  }
};