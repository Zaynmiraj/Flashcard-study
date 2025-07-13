import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { StudySession } from '@/types';

interface ProgressChartProps {
  sessions: StudySession[];
  days?: number;
}

const { width } = Dimensions.get('window');

export const ProgressChart: React.FC<ProgressChartProps> = ({ sessions, days = 7 }) => {
  const { theme } = useTheme();

  const getLastNDays = (n: number) => {
    const dates = [];
    for (let i = n - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
  };

  const lastNDays = getLastNDays(days);
  const maxCards = Math.max(
    ...lastNDays.map(date => {
      const daysSessions = sessions.filter(session => 
        session.startTime.split('T')[0] === date
      );
      return daysSessions.reduce((sum, session) => sum + session.cardsStudied, 0);
    }),
    1
  );

  const styles = StyleSheet.create({
    container: {
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
    title: {
      fontSize: 18,
      fontFamily: 'Inter-SemiBold',
      color: theme.text,
      marginBottom: 20,
    },
    chart: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      height: 120,
      marginBottom: 16,
    },
    bar: {
      width: (width - 80) / days - 4,
      backgroundColor: theme.primary,
      borderRadius: 4,
      minHeight: 2,
    },
    labels: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    label: {
      fontSize: 12,
      fontFamily: 'Inter-Regular',
      color: theme.textSecondary,
      textAlign: 'center',
      width: (width - 80) / days,
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Study Activity ({days} days)</Text>
      
      <View style={styles.chart}>
        {lastNDays.map((date, index) => {
          const daysSessions = sessions.filter(session => 
            session.startTime.split('T')[0] === date
          );
          const cardsStudied = daysSessions.reduce((sum, session) => sum + session.cardsStudied, 0);
          const height = Math.max((cardsStudied / maxCards) * 100, 2);
          
          return (
            <View
              key={date}
              style={[styles.bar, { height }]}
            />
          );
        })}
      </View>
      
      <View style={styles.labels}>
        {lastNDays.map((date, index) => {
          const dayName = new Date(date).toLocaleDateString('en', { weekday: 'short' });
          return (
            <Text key={date} style={styles.label}>
              {dayName}
            </Text>
          );
        })}
      </View>
    </View>
  );
};