export interface Card {
  id: string;
  front: string;
  back: string;
  difficulty: number; // 0-4 for Leitner system
  lastReviewed: string;
  nextReview: string;
  reviewCount: number;
  correctCount: number;
}

export interface Deck {
  id: string;
  name: string;
  description: string;
  color: string;
  cards: Card[];
  createdAt: string;
  lastStudied: string;
  totalStudyTime: number;
}

export interface StudySession {
  id: string;
  deckId: string;
  startTime: string;
  endTime: string;
  cardsStudied: number;
  correctAnswers: number;
  incorrectAnswers: number;
}

export interface Settings {
  theme: 'light' | 'dark' | 'sepia';
  studyReminders: boolean;
  dailyGoal: number;
  soundEnabled: boolean;
}

export type Theme = {
  background: string;
  surface: string;
  primary: string;
  accent: string;
  text: string;
  textSecondary: string;
  border: string;
  card: string;
  success: string;
  warning: string;
  error: string;
};