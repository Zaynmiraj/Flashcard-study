import { Card } from '@/types';

// Leitner system intervals (in days)
const INTERVALS = [1, 2, 4, 8, 16];

export const calculateNextReview = (difficulty: number, correct: boolean): { nextReview: string; newDifficulty: number } => {
  let newDifficulty = difficulty;
  
  if (correct) {
    newDifficulty = Math.min(4, difficulty + 1);
  } else {
    newDifficulty = Math.max(0, difficulty - 1);
  }
  
  const interval = INTERVALS[newDifficulty] || 1;
  const nextReview = new Date();
  nextReview.setDate(nextReview.getDate() + interval);
  
  return {
    nextReview: nextReview.toISOString(),
    newDifficulty,
  };
};

export const getCardsForReview = (cards: Card[]): Card[] => {
  const now = new Date();
  return cards.filter(card => new Date(card.nextReview) <= now);
};

export const getStudyStats = (cards: Card[]) => {
  const total = cards.length;
  const mastered = cards.filter(card => card.difficulty >= 3).length;
  const learning = cards.filter(card => card.difficulty > 0 && card.difficulty < 3).length;
  const new_cards = cards.filter(card => card.difficulty === 0).length;
  
  return { total, mastered, learning, new: new_cards };
};