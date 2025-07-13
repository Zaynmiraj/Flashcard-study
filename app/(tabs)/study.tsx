import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Check, X, RotateCcw, Home } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { useStorage } from '@/hooks/useStorage';
import { FlashCard } from '@/components/FlashCard';
import { calculateNextReview, getCardsForReview } from '@/utils/spacedRepetition';
import { Card, StudySession } from '@/types';

export default function StudyScreen() {
  const { theme } = useTheme();
  const { decks, sessions, saveDecks, saveSessions } = useStorage();
  const router = useRouter();
  
  const [currentSession, setCurrentSession] = useState<StudySession | null>(null);
  const [studyCards, setStudyCards] = useState<Card[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [sessionStats, setSessionStats] = useState({
    correct: 0,
    incorrect: 0,
    total: 0,
  });

  useEffect(() => {
    initializeStudySession();
  }, [decks]);

  const initializeStudySession = () => {
    const allCardsToReview = decks.flatMap(deck => 
      getCardsForReview(deck.cards).map(card => ({ ...card, deckId: deck.id }))
    );
    
    if (allCardsToReview.length > 0) {
      const session: StudySession = {
        id: Date.now().toString(),
        deckId: 'mixed',
        startTime: new Date().toISOString(),
        endTime: '',
        cardsStudied: 0,
        correctAnswers: 0,
        incorrectAnswers: 0,
      };
      
      setCurrentSession(session);
      setStudyCards(allCardsToReview);
      setCurrentCardIndex(0);
      setShowAnswer(false);
      setSessionStats({ correct: 0, incorrect: 0, total: allCardsToReview.length });
    }
  };

  const handleAnswer = (correct: boolean) => {
    if (!currentSession || !studyCards[currentCardIndex]) return;

    const currentCard = studyCards[currentCardIndex];
    const { nextReview, newDifficulty } = calculateNextReview(currentCard.difficulty, correct);
    
    // Update card in the appropriate deck
    const updatedDecks = decks.map(deck => {
      if (deck.id === (currentCard as any).deckId) {
        return {
          ...deck,
          cards: deck.cards.map(card => 
            card.id === currentCard.id
              ? {
                  ...card,
                  difficulty: newDifficulty,
                  nextReview,
                  lastReviewed: new Date().toISOString(),
                  reviewCount: card.reviewCount + 1,
                  correctCount: correct ? card.correctCount + 1 : card.correctCount,
                }
              : card
          ),
        };
      }
      return deck;
    });

    saveDecks(updatedDecks);

    // Update session stats
    const newStats = {
      ...sessionStats,
      correct: correct ? sessionStats.correct + 1 : sessionStats.correct,
      incorrect: correct ? sessionStats.incorrect : sessionStats.incorrect + 1,
    };
    setSessionStats(newStats);

    // Move to next card or finish session
    if (currentCardIndex < studyCards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setShowAnswer(false);
    } else {
      finishSession(newStats);
    }
  };

  const finishSession = (stats: typeof sessionStats) => {
    if (!currentSession) return;

    const finishedSession: StudySession = {
      ...currentSession,
      endTime: new Date().toISOString(),
      cardsStudied: stats.correct + stats.incorrect,
      correctAnswers: stats.correct,
      incorrectAnswers: stats.incorrect,
    };

    saveSessions([...sessions, finishedSession]);
    
    Alert.alert(
      'Session Complete!',
      `You studied ${stats.correct + stats.incorrect} cards with ${Math.round((stats.correct / (stats.correct + stats.incorrect)) * 100)}% accuracy.`,
      [
        { text: 'Study More', onPress: initializeStudySession },
        { text: 'Done', onPress: () => setCurrentSession(null) },
      ]
    );
  };

  const resetSession = () => {
    Alert.alert(
      'Reset Session',
      'Are you sure you want to restart your study session?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Reset', onPress: initializeStudySession },
      ]
    );
  };

  const goHome = () => {
    router.push('/(tabs)');
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    header: {
      paddingTop: 60,
      paddingHorizontal: 20,
      paddingBottom: 20,
      alignItems: 'center',
    },
    title: {
      fontSize: 24,
      fontFamily: 'Inter-Bold',
      color: theme.text,
      marginBottom: 8,
    },
    progress: {
      fontSize: 16,
      fontFamily: 'Inter-Regular',
      color: theme.textSecondary,
    },
    progressBar: {
      height: 4,
      backgroundColor: theme.border,
      borderRadius: 2,
      marginTop: 12,
      marginHorizontal: 20,
    },
    progressFill: {
      height: '100%',
      backgroundColor: theme.primary,
      borderRadius: 2,
    },
    cardContainer: {
      flex: 1,
      justifyContent: 'center',
    },
    controls: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingBottom: 40,
      gap: 20,
    },
    controlButton: {
      width: 60,
      height: 60,
      borderRadius: 30,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 4,
    },
    incorrectButton: {
      backgroundColor: theme.error,
    },
    correctButton: {
      backgroundColor: theme.success,
    },
    resetButton: {
      backgroundColor: theme.textSecondary,
    },
    emptyState: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 40,
    },
    emptyTitle: {
      fontSize: 24,
      fontFamily: 'Inter-Bold',
      color: theme.text,
      marginBottom: 12,
      textAlign: 'center',
    },
    emptyText: {
      fontSize: 16,
      fontFamily: 'Inter-Regular',
      color: theme.textSecondary,
      textAlign: 'center',
      lineHeight: 24,
      marginBottom: 32,
    },
    homeButton: {
      backgroundColor: theme.primary,
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 24,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    homeButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontFamily: 'Inter-SemiBold',
    },
  });

  if (!currentSession || studyCards.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No cards to review!</Text>
          <Text style={styles.emptyText}>
            Great job! You've reviewed all your cards for today. Come back tomorrow or create new decks to continue learning.
          </Text>
          <TouchableOpacity style={styles.homeButton} onPress={goHome}>
            <Home size={20} color="#FFFFFF" />
            <Text style={styles.homeButtonText}>Go Home</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const progress = ((currentCardIndex) / studyCards.length) * 100;
  const currentCard = studyCards[currentCardIndex];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Study Session</Text>
        <Text style={styles.progress}>
          {currentCardIndex + 1} of {studyCards.length} cards
        </Text>
      </View>
      
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${progress}%` }]} />
      </View>

      <View style={styles.cardContainer}>
        <FlashCard
          card={currentCard}
          showAnswer={showAnswer}
          onFlip={() => setShowAnswer(!showAnswer)}
        />
      </View>

      {showAnswer && (
        <View style={styles.controls}>
          <TouchableOpacity
            style={[styles.controlButton, styles.incorrectButton]}
            onPress={() => handleAnswer(false)}
          >
            <X size={28} color="#FFFFFF" />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.controlButton, styles.resetButton]}
            onPress={resetSession}
          >
            <RotateCcw size={24} color="#FFFFFF" />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.controlButton, styles.correctButton]}
            onPress={() => handleAnswer(true)}
          >
            <Check size={28} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}