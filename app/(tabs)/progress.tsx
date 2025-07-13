import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Trophy, Target, Calendar, TrendingUp } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useStorage } from '@/hooks/useStorage';
import { ProgressChart } from '@/components/ProgressChart';
import { getStudyStats } from '@/utils/spacedRepetition';

export default function ProgressScreen() {
  const { theme } = useTheme();
  const { decks, sessions } = useStorage();

  const totalCards = decks.reduce((sum, deck) => sum + deck.cards.length, 0);
  const allCards = decks.flatMap(deck => deck.cards);
  const stats = getStudyStats(allCards);
  
  const totalStudyTime = sessions.reduce((sum, session) => {
    const start = new Date(session.startTime);
    const end = new Date(session.endTime || session.startTime);
    return sum + (end.getTime() - start.getTime());
  }, 0);
  
  const streak = calculateStreak(sessions);
  const totalSessions = sessions.length;

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    header: {
      paddingTop: 60,
      paddingHorizontal: 20,
      paddingBottom: 20,
    },
    title: {
      fontSize: 28,
      fontFamily: 'Inter-Bold',
      color: theme.text,
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 16,
      fontFamily: 'Inter-Regular',
      color: theme.textSecondary,
    },
    statsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      paddingHorizontal: 16,
      marginBottom: 20,
    },
    statCard: {
      width: '48%',
      backgroundColor: theme.card,
      borderRadius: 16,
      padding: 20,
      margin: '1%',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    statIcon: {
      alignSelf: 'flex-start',
      marginBottom: 12,
    },
    statValue: {
      fontSize: 24,
      fontFamily: 'Inter-Bold',
      color: theme.text,
      marginBottom: 4,
    },
    statLabel: {
      fontSize: 14,
      fontFamily: 'Inter-Medium',
      color: theme.textSecondary,
    },
    progressCard: {
      backgroundColor: theme.card,
      borderRadius: 16,
      padding: 20,
      margin: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    progressTitle: {
      fontSize: 18,
      fontFamily: 'Inter-SemiBold',
      color: theme.text,
      marginBottom: 16,
    },
    progressBar: {
      height: 8,
      backgroundColor: theme.border,
      borderRadius: 4,
      marginBottom: 8,
    },
    progressFill: {
      height: '100%',
      borderRadius: 4,
    },
    progressText: {
      fontSize: 14,
      fontFamily: 'Inter-Regular',
      color: theme.textSecondary,
      textAlign: 'center',
    },
    masteryStats: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 16,
    },
    masteryItem: {
      alignItems: 'center',
    },
    masteryValue: {
      fontSize: 20,
      fontFamily: 'Inter-Bold',
      marginBottom: 4,
    },
    masteryLabel: {
      fontSize: 12,
      fontFamily: 'Inter-Regular',
      color: theme.textSecondary,
    },
  });

  function calculateStreak(sessions: any[]) {
    if (sessions.length === 0) return 0;
    
    const today = new Date().toISOString().split('T')[0];
    const sortedDates = [...new Set(sessions.map(s => s.startTime.split('T')[0]))].sort().reverse();
    
    let streak = 0;
    let currentDate = new Date();
    
    for (const date of sortedDates) {
      const sessionDate = new Date(date);
      const diffTime = currentDate.getTime() - sessionDate.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays <= streak + 1) {
        streak++;
        currentDate = sessionDate;
      } else {
        break;
      }
    }
    
    return streak;
  }

  const masteryPercentage = totalCards > 0 ? (stats.mastered / totalCards) * 100 : 0;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Your Progress</Text>
        <Text style={styles.subtitle}>Track your learning journey</Text>
      </View>

      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Trophy size={24} color={theme.primary} style={styles.statIcon} />
          <Text style={styles.statValue}>{streak}</Text>
          <Text style={styles.statLabel}>Day Streak</Text>
        </View>
        
        <View style={styles.statCard}>
          <Target size={24} color={theme.accent} style={styles.statIcon} />
          <Text style={styles.statValue}>{totalSessions}</Text>
          <Text style={styles.statLabel}>Study Sessions</Text>
        </View>
        
        <View style={styles.statCard}>
          <Calendar size={24} color={theme.success} style={styles.statIcon} />
          <Text style={styles.statValue}>
            {Math.round(totalStudyTime / (1000 * 60))}m
          </Text>
          <Text style={styles.statLabel}>Study Time</Text>
        </View>
        
        <View style={styles.statCard}>
          <TrendingUp size={24} color={theme.warning} style={styles.statIcon} />
          <Text style={styles.statValue}>{totalCards}</Text>
          <Text style={styles.statLabel}>Total Cards</Text>
        </View>
      </View>

      <View style={styles.progressCard}>
        <Text style={styles.progressTitle}>Mastery Progress</Text>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { 
                width: `${masteryPercentage}%`,
                backgroundColor: theme.primary,
              }
            ]} 
          />
        </View>
        <Text style={styles.progressText}>
          {Math.round(masteryPercentage)}% of cards mastered
        </Text>
        
        <View style={styles.masteryStats}>
          <View style={styles.masteryItem}>
            <Text style={[styles.masteryValue, { color: theme.success }]}>
              {stats.mastered}
            </Text>
            <Text style={styles.masteryLabel}>Mastered</Text>
          </View>
          
          <View style={styles.masteryItem}>
            <Text style={[styles.masteryValue, { color: theme.warning }]}>
              {stats.learning}
            </Text>
            <Text style={styles.masteryLabel}>Learning</Text>
          </View>
          
          <View style={styles.masteryItem}>
            <Text style={[styles.masteryValue, { color: theme.textSecondary }]}>
              {stats.new}
            </Text>
            <Text style={styles.masteryLabel}>New</Text>
          </View>
        </View>
      </View>

      <ProgressChart sessions={sessions} days={7} />
    </ScrollView>
  );
}