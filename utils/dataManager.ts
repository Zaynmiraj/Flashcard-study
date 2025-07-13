import { Deck, StudySession, Settings } from '@/types';

export interface ExportData {
  decks: Deck[];
  sessions: StudySession[];
  settings: Settings;
  exportDate: string;
  version: string;
}

export const exportData = (
  decks: Deck[],
  sessions: StudySession[],
  settings: Settings
): string => {
  const exportData: ExportData = {
    decks,
    sessions,
    settings,
    exportDate: new Date().toISOString(),
    version: '1.0.0',
  };

  return JSON.stringify(exportData, null, 2);
};

export const importData = (jsonString: string): ExportData => {
  try {
    const data = JSON.parse(jsonString);
    
    // Validate the structure
    if (!data.decks || !Array.isArray(data.decks)) {
      throw new Error('Invalid decks data');
    }
    
    if (!data.sessions || !Array.isArray(data.sessions)) {
      throw new Error('Invalid sessions data');
    }
    
    if (!data.settings || typeof data.settings !== 'object') {
      throw new Error('Invalid settings data');
    }

    // Ensure all required fields exist
    const defaultSettings: Settings = {
      theme: 'light',
      studyReminders: true,
      dailyGoal: 20,
      soundEnabled: true,
    };

    return {
      decks: data.decks,
      sessions: data.sessions,
      settings: { ...defaultSettings, ...data.settings },
      exportDate: data.exportDate || new Date().toISOString(),
      version: data.version || '1.0.0',
    };
  } catch (error) {
    throw new Error('Invalid backup file format');
  }
};

export const createSampleData = (): ExportData => {
  const sampleDecks: Deck[] = [
    {
      id: 'sample-1',
      name: 'Spanish Basics',
      description: 'Essential Spanish vocabulary for beginners',
      color: '#4A90E2',
      createdAt: new Date().toISOString(),
      lastStudied: '',
      totalStudyTime: 0,
      cards: [
        {
          id: 'card-1',
          front: 'Hello',
          back: 'Hola',
          difficulty: 0,
          lastReviewed: '',
          nextReview: new Date().toISOString(),
          reviewCount: 0,
          correctCount: 0,
        },
        {
          id: 'card-2',
          front: 'Thank you',
          back: 'Gracias',
          difficulty: 0,
          lastReviewed: '',
          nextReview: new Date().toISOString(),
          reviewCount: 0,
          correctCount: 0,
        },
        {
          id: 'card-3',
          front: 'Goodbye',
          back: 'Adiós',
          difficulty: 0,
          lastReviewed: '',
          nextReview: new Date().toISOString(),
          reviewCount: 0,
          correctCount: 0,
        },
      ],
    },
    {
      id: 'sample-2',
      name: 'Math Formulas',
      description: 'Important mathematical formulas and equations',
      color: '#50E3C2',
      createdAt: new Date().toISOString(),
      lastStudied: '',
      totalStudyTime: 0,
      cards: [
        {
          id: 'card-4',
          front: 'Area of a circle',
          back: 'π × r²',
          difficulty: 0,
          lastReviewed: '',
          nextReview: new Date().toISOString(),
          reviewCount: 0,
          correctCount: 0,
        },
        {
          id: 'card-5',
          front: 'Pythagorean theorem',
          back: 'a² + b² = c²',
          difficulty: 0,
          lastReviewed: '',
          nextReview: new Date().toISOString(),
          reviewCount: 0,
          correctCount: 0,
        },
      ],
    },
  ];

  const sampleSessions: StudySession[] = [];

  const sampleSettings: Settings = {
    theme: 'light',
    studyReminders: true,
    dailyGoal: 20,
    soundEnabled: true,
  };

  return {
    decks: sampleDecks,
    sessions: sampleSessions,
    settings: sampleSettings,
    exportDate: new Date().toISOString(),
    version: '1.0.0',
  };
};