
import { GoogleGenAI } from "@google/genai";

export async function applyMaterialToPhoto(personPhotoBase64: string, materialPhotoUrl: string, materialName: string, targetGarment: string): Promise<string | null> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // We need the material image as base64 too if we want Gemini to see its texture accurately.
  // For this demo, we'll fetch the material and convert it, or just describe it.
  // Using gemini-2.5-flash-image for visual editing.
  
  try {
    const materialResponse = await fetch(materialPhotoUrl);
    const materialBlob = await materialResponse.blob();
    const materialBase64 = await blobToBase64(materialBlob);

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: personPhotoBase64.split(',')[1],
              mimeType: 'image/jpeg',
            },
          },
          {
            inlineData: {
              data: materialBase64.split(',')[1],
              mimeType: 'image/jpeg',
            },
          },
          {
            text: `This is a high-fidelity virtual try-on task. 
            Image 1: A person wearing clothes.
            Image 2: A fabric material swatch called "${materialName}".
            Task: Replace the material of the ${targetGarment} worn by the person in Image 1 with the exact fabric pattern, texture, and color shown in Image 2. 
            Maintain all original folds, shadows, lighting, and fit of the clothing. The person's face, hair, and background must remain identical.`,
          },
        ],
      },
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    
    return null;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
}

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
