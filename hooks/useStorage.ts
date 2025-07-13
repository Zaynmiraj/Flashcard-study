import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Deck, StudySession, Settings } from '@/types';
import { createSampleData } from '@/utils/dataManager';

const STORAGE_KEYS = {
  DECKS: 'quickcards_decks',
  SESSIONS: 'quickcards_sessions',
  SETTINGS: 'quickcards_settings',
  FIRST_LAUNCH: 'quickcards_first_launch',
};

export const useStorage = () => {
  const [decks, setDecks] = useState<Deck[]>([]);
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [settings, setSettings] = useState<Settings>({
    theme: 'light',
    studyReminders: true,
    dailyGoal: 20,
    soundEnabled: true,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [decksData, sessionsData, settingsData, firstLaunch] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.DECKS),
        AsyncStorage.getItem(STORAGE_KEYS.SESSIONS),
        AsyncStorage.getItem(STORAGE_KEYS.SETTINGS),
        AsyncStorage.getItem(STORAGE_KEYS.FIRST_LAUNCH),
      ]);

      // If it's the first launch, load sample data
      if (!firstLaunch) {
        const sampleData = createSampleData();
        setDecks(sampleData.decks);
        setSessions(sampleData.sessions);
        setSettings(sampleData.settings);
        
        // Save sample data and mark first launch as complete
        await Promise.all([
          AsyncStorage.setItem(STORAGE_KEYS.DECKS, JSON.stringify(sampleData.decks)),
          AsyncStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sampleData.sessions)),
          AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(sampleData.settings)),
          AsyncStorage.setItem(STORAGE_KEYS.FIRST_LAUNCH, 'true'),
        ]);
      } else {
        // Load existing data
        if (decksData) setDecks(JSON.parse(decksData));
        if (sessionsData) setSessions(JSON.parse(sessionsData));
        if (settingsData) setSettings(JSON.parse(settingsData));
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveDecks = async (newDecks: Deck[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.DECKS, JSON.stringify(newDecks));
      setDecks(newDecks);
    } catch (error) {
      console.error('Error saving decks:', error);
    }
  };

  const saveSessions = async (newSessions: StudySession[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(newSessions));
      setSessions(newSessions);
    } catch (error) {
      console.error('Error saving sessions:', error);
    }
  };

  const saveSettings = async (newSettings: Settings) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(newSettings));
      setSettings(newSettings);
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  return {
    decks,
    sessions,
    settings,
    loading,
    saveDecks,
    saveSessions,
    saveSettings,
  };
};