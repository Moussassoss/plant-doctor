import axios from 'axios';
import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';
import { saveHistoryItem } from './historyService';
import Constants from 'expo-constants';

const OPENAI_API_KEY = Constants.expoConfig?.extra?.OPENAI_API_KEY || process.env.OPENAI_API_KEY;

type AnalysisResult = {
  isPlant: boolean;
  disease: string | null;
  description: string | null;
  treatment: string | null;
  confidence: number | null;
};

export const detectPlantDisease = async (imageUri: string): Promise<AnalysisResult> => {
  try {
    const base64Image = await fileToBase64(imageUri);
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Analyze this image and determine if it contains a plant or leaf. If it does, identify any diseases or issues the plant might have, provide a description of the disease, and suggest treatment options. If the image does not contain a plant or leaf, simply respond with "not a plant". Format your response as JSON with the following structure: { "isPlant": boolean, "disease": string or null, "description": string or null, "treatment": string or null }'
              },
              {
                type: 'image_url',
                image_url: {
                  url: `data:image/jpeg;base64,${base64Image}`
                }
              }
            ]
          }
        ],
        max_tokens: 1000
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`
        }
      }
    );
    console.log('Raw API response:', response.data);
    const message = response.data.choices[0].message.content;
    console.log('Full message content:', message);
    let parsedResponse;
    try {
      // Extract JSON from Markdown code block if present
      const jsonMatch = message.match(/```json[\s\S]*?({[\s\S]*?})[\s\S]*?```/);
      const jsonString = jsonMatch ? jsonMatch[1] : message;
      parsedResponse = JSON.parse(jsonString);
    } catch (error) {
      throw new Error('Failed to parse the analysis result.');
    }
    const result: AnalysisResult = {
      isPlant: parsedResponse.isPlant,
      disease: parsedResponse.disease,
      description: parsedResponse.description,
      treatment: parsedResponse.treatment,
      confidence: parsedResponse.confidence || 0.8
    };
    await saveHistoryItem({
      imageUri,
      ...result,
      timestamp: new Date().toISOString(),
    });
    return result;
  } catch (error) {
    console.error('Error detecting plant disease:', error);
    throw new Error('Failed to analyze the image. Please try again.');
  }
};

const fileToBase64 = async (uri: string): Promise<string> => {
  if (Platform.OS === 'web') {
    const response = await fetch(uri);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = String(reader.result).split(',')[1];
        resolve(base64String);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } else {
    const base64 = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    return base64;
  }
};