import { Link, Stack } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { Home } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';

export default function NotFoundScreen() {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
      backgroundColor: theme.background,
    },
    text: {
      fontSize: 20,
      fontFamily: 'Inter-SemiBold',
      color: theme.text,
      marginBottom: 20,
      textAlign: 'center',
    },
    description: {
      fontSize: 16,
      fontFamily: 'Inter-Regular',
      color: theme.textSecondary,
      marginBottom: 30,
      textAlign: 'center',
    },
    link: {
      backgroundColor: theme.primary,
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 24,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    linkText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontFamily: 'Inter-SemiBold',
    },
  });

  return (
    <>
      <Stack.Screen options={{ title: 'Oops!', headerShown: false }} />
      <View style={styles.container}>
        <Text style={styles.text}>This screen doesn't exist.</Text>
        <Text style={styles.description}>
          The page you're looking for could not be found.
        </Text>
        <Link href="/" style={styles.link}>
          <Home size={20} color="#FFFFFF" />
          <Text style={styles.linkText}>Go to home screen</Text>
        </Link>
      </View>
    </>
  );
}