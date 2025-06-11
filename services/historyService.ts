import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

export type HistoryItem = {
  id: string;
  imageUri: string;
  isPlant: boolean;
  disease: string | null;
  description: string | null;
  treatment: string | null;
  confidence: number | null;
  timestamp: string;
};

const HISTORY_STORAGE_KEY = 'plant_doctor_history';

// For web platform, we'll use a mock version of AsyncStorage using localStorage
const asyncStorage = Platform.OS === 'web' 
  ? {
      getItem: async (key: string) => {
        return localStorage.getItem(key);
      },
      setItem: async (key: string, value: string) => {
        localStorage.setItem(key, value);
      },
    }
  : AsyncStorage;

export const saveHistoryItem = async (item: Omit<HistoryItem, 'id'>): Promise<void> => {
  try {
    // Generate a unique ID
    const id = Date.now().toString();
    const newItem: HistoryItem = {
      ...item,
      id,
    };
    
    // Get existing history
    const existingHistory = await getHistoryItems();
    
    // Add new item to history
    const updatedHistory = [newItem, ...existingHistory];
    
    // Only keep the last 50 items to avoid storage issues
    const trimmedHistory = updatedHistory.slice(0, 50);
    
    // Save updated history
    await asyncStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(trimmedHistory));
  } catch (error) {
    console.error('Error saving history item:', error);
    throw new Error('Failed to save scan to history.');
  }
};

export const getHistoryItems = async (): Promise<HistoryItem[]> => {
  try {
    const historyJson = await asyncStorage.getItem(HISTORY_STORAGE_KEY);
    
    if (!historyJson) {
      return [];
    }
    
    return JSON.parse(historyJson) as HistoryItem[];
  } catch (error) {
    console.error('Error getting history items:', error);
    return [];
  }
};

export const clearHistory = async (): Promise<void> => {
  try {
    await asyncStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify([]));
  } catch (error) {
    console.error('Error clearing history:', error);
    throw new Error('Failed to clear history.');
  }
};

// Mock data for development
export const getMockHistoryItems = (): HistoryItem[] => {
  return [
    {
      id: '1',
      imageUri: 'https://images.pexels.com/photos/3511755/pexels-photo-3511755.jpeg',
      isPlant: true,
      disease: 'Leaf Spot',
      description: 'Leaf spot is a common plant disease characterized by brown or black spots on leaves.',
      treatment: 'Remove infected leaves and apply fungicide as directed.',
      confidence: 0.85,
      timestamp: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: '2',
      imageUri: 'https://images.pexels.com/photos/807598/pexels-photo-807598.jpeg',
      isPlant: true,
      disease: null,
      description: 'The plant appears healthy with no visible signs of disease.',
      treatment: null,
      confidence: 0.92,
      timestamp: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: '3',
      imageUri: 'https://images.pexels.com/photos/2253844/pexels-photo-2253844.jpeg',
      isPlant: false,
      disease: null,
      description: null,
      treatment: null,
      confidence: null,
      timestamp: new Date(Date.now() - 172800000).toISOString(),
    },
  ];
};