import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '@/constants/theme';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Animated.Text 
            entering={FadeInDown.delay(100).duration(700)}
            style={styles.title}>Plant Doctor</Animated.Text>
          <Animated.Text 
            entering={FadeInDown.delay(300).duration(700)}
            style={styles.subtitle}>Diagnose plant diseases instantly with AI</Animated.Text>
        </View>

        <Animated.View 
          entering={FadeInDown.delay(500).duration(700)}
          style={styles.heroContainer}>
          <Image
            source={{ uri: 'https://images.pexels.com/photos/4505170/pexels-photo-4505170.jpeg' }}
            style={styles.heroImage}
            resizeMode="cover"
          />
          <View style={styles.heroOverlay}>
            <Text style={styles.heroText}>Identify plant diseases and get treatment recommendations</Text>
          </View>
        </Animated.View>

        <Animated.View 
          entering={FadeInDown.delay(700).duration(700)}
          style={styles.actionsContainer}>
          <Text style={styles.actionTitle}>Get Started</Text>
          <View style={styles.buttonContainer}>
          
            <TouchableOpacity 
              style={[styles.button, styles.primaryButton]}
              onPress={() => router.push('/scan')}>
              <MaterialIcons name="photo-camera" size={24} color={theme.colors.white} />
              <Text style={styles.primaryButtonText}>Capture Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.button, styles.secondaryButton]}
              onPress={() => router.push('/scan?gallery=true')}>
              <MaterialIcons name="image" size={24} color={theme.colors.primary[600]} />
              <Text style={styles.secondaryButtonText}>Upload Image</Text>
            </TouchableOpacity>
            </View>
          <Text style={styles.featuresTitle}>How It Works</Text>
          <View style={styles.featureCard}>
            <Text style={styles.featureNumber}>1</Text>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Take a Clear Photo</Text>
              <Text style={styles.featureDescription}>
                Capture a clear, well-lit photo of the affected plant leaf or upload an existing image
              </Text>
            </View>
          </View>
          <View style={styles.featureCard}>
            <Text style={styles.featureNumber}>2</Text>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>AI Analysis</Text>
              <Text style={styles.featureDescription}>
                Our AI instantly analyzes the image to identify plant diseases
              </Text>
            </View>
          </View>
          <View style={styles.featureCard}>
            <Text style={styles.featureNumber}>3</Text>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Get Recommendations</Text>
              <Text style={styles.featureDescription}>
                Receive detailed information about the disease and treatment recommendations
              </Text>
            </View>
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
  },
  title: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 28,
    color: theme.colors.primary[700],
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: theme.colors.gray[600],
    lineHeight: 22,
  },
  heroContainer: {
    marginHorizontal: 24,
    marginTop: 16,
    height: 200,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 24,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 16,
  },
  heroText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: theme.colors.white,
    textAlign: 'center',
  },
  actionsContainer: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  actionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: theme.colors.gray[800],
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  button: {
    flex: 1,
    borderRadius: 12,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  primaryButton: {
    backgroundColor: theme.colors.primary[600],
  },
  secondaryButton: {
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: theme.colors.primary[600],
  },
  primaryButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 15,
    color: theme.colors.white,
  },
  secondaryButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 15,
    color: theme.colors.primary[600],
  },
  featuresContainer: {
    paddingHorizontal: 24,
    marginBottom: 40,
  },
  featuresTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: theme.colors.gray[800],
    margin: 20,
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: theme.colors.gray[50],
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  featureNumber: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 20,
    color: theme.colors.primary[600],
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.primary[100],
    textAlign: 'center',
    lineHeight: 32,
  },
  featureContent: {
    flex: 1,
    marginLeft: 16,
  },
  featureTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: theme.colors.gray[800],
    marginBottom: 4,
  },
  featureDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: theme.colors.gray[600],
    lineHeight: 20,
  },
});
// Camera and ImageIcon replaced with MaterialIcons for compatibility