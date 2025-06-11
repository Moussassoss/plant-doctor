import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { theme } from '@/constants/theme';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function InfoScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>About</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View 
          entering={FadeInDown.delay(100).duration(500)}
          style={styles.infoCard}>
          <View style={styles.cardHeader}>
            <View style={styles.iconContainer}>
            <Feather name="feather" size={20} color={theme.colors.primary[600]} />

            </View>
            <Text style={styles.cardTitle}>About Plant Doctor</Text>
          </View>
          <Text style={styles.cardText}>
            Plant Doctor uses advanced AI to help you identify plant diseases and get treatment recommendations. 
            Simply take a photo of a plant leaf showing signs of disease, and our system will analyze it to provide 
            useful information and advice.
          </Text>
        </Animated.View>

        <Animated.View 
          entering={FadeInDown.delay(200).duration(500)}
          style={styles.infoCard}>
          <View style={styles.cardHeader}>
            <View style={styles.iconContainer}>
            <Feather name="help-circle" size={20} color={theme.colors.primary[600]} />
            </View>
            <Text style={styles.cardTitle}>How to Use</Text>
          </View>
          <View style={styles.stepContainer}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>1</Text>
            </View>
            <Text style={styles.stepText}>
              Take a clear, well-lit photo of the affected plant leaf, ensuring the diseased area is clearly visible.
            </Text>
          </View>
          <View style={styles.stepContainer}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>2</Text>
            </View>
            <Text style={styles.stepText}>
              Wait for the analysis to complete. This usually takes 5-10 seconds.
            </Text>
          </View>
          <View style={styles.stepContainer}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>3</Text>
            </View>
            <Text style={styles.stepText}>
              Review the diagnosis and treatment recommendations.
            </Text>
          </View>
        </Animated.View>

        <Animated.View 
          entering={FadeInDown.delay(300).duration(500)}
          style={styles.infoCard}>
          <View style={styles.cardHeader}>
            <View style={styles.iconContainer}>
            <Feather name="alert-circle" size={20} color={theme.colors.primary[600]} />
            </View>
            <Text style={styles.cardTitle}>Limitations</Text>
          </View>
          <Text style={styles.cardText}>
            While our AI system is powerful, it has limitations:
          </Text>
          <View style={styles.bulletContainer}>
            <View style={styles.bullet} />
            <Text style={styles.bulletText}>
              The diagnosis is only as good as the image quality you provide
            </Text>
          </View>
          <View style={styles.bulletContainer}>
            <View style={styles.bullet} />
            <Text style={styles.bulletText}>
              Some rare or visually similar plant diseases may be difficult to distinguish
            </Text>
          </View>
          <View style={styles.bulletContainer}>
            <View style={styles.bullet} />
            <Text style={styles.bulletText}>
              For critical crop issues, consult with a professional botanist or agriculturist
            </Text>
          </View>
        </Animated.View>

        <Animated.View 
          entering={FadeInDown.delay(400).duration(500)}
          style={styles.infoCard}>
          <View style={styles.cardHeader}>
            <View style={styles.iconContainer}>
            <Feather name="info" size={20} color={theme.colors.primary[600]} />
            </View>
            <Text style={styles.cardTitle}>Tips for Best Results</Text>
          </View>
          <View style={styles.bulletContainer}>
            <View style={styles.bullet} />
            <Text style={styles.bulletText}>
              Take photos in good natural light
            </Text>
          </View>
          <View style={styles.bulletContainer}>
            <View style={styles.bullet} />
            <Text style={styles.bulletText}>
              Focus on the affected area of the plant
            </Text>
          </View>
          <View style={styles.bulletContainer}>
            <View style={styles.bullet} />
            <Text style={styles.bulletText}>
              Include both healthy and diseased parts for comparison
            </Text>
          </View>
          <View style={styles.bulletContainer}>
            <View style={styles.bullet} />
            <Text style={styles.bulletText}>
              Avoid shadows and reflections on the leaf surface
            </Text>
          </View>
        </Animated.View>

        <Animated.View 
          entering={FadeInDown.delay(500).duration(500)}
          style={styles.linkCard}>
          <TouchableOpacity 
            style={styles.linkItem}
            onPress={() => Linking.openURL('https://example.com/privacy')}>
            <Text style={styles.linkText}>Privacy Policy</Text>
            <Feather name="external-link" size={16} color={theme.colors.gray[600]} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.linkItem}
            onPress={() => Linking.openURL('https://example.com/terms')}>
            <Text style={styles.linkText}>Terms of Service</Text>
            <Feather name="external-link" size={16} color={theme.colors.gray[600]} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.linkItem}
            onPress={() => Linking.openURL('https://example.com/support')}>
            <Text style={styles.linkText}>Contact Support</Text>
            <Feather name="chevron-right" size={16} color={theme.colors.gray[600]} />
          </TouchableOpacity>
        </Animated.View>

        <Text style={styles.versionText}>Version 1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.gray[50],
  },
  header: {
    padding: 24,
    backgroundColor: theme.colors.white,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray[200],
  },
  title: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 24,
    color: theme.colors.gray[800],
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  infoCard: {
    backgroundColor: theme.colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: theme.colors.gray[200],
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primary[50],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: theme.colors.gray[800],
  },
  cardText: {
    fontFamily: 'Inter-Regular',
    fontSize: 15,
    color: theme.colors.gray[700],
    lineHeight: 22,
    marginBottom: 12,
  },
  stepContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: theme.colors.primary[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  stepNumberText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: theme.colors.primary[700],
  },
  stepText: {
    fontFamily: 'Inter-Regular',
    fontSize: 15,
    color: theme.colors.gray[700],
    flex: 1,
    lineHeight: 22,
  },
  bulletContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.primary[600],
    marginRight: 10,
    marginTop: 8,
  },
  bulletText: {
    fontFamily: 'Inter-Regular',
    fontSize: 15,
    color: theme.colors.gray[700],
    flex: 1,
    lineHeight: 22,
  },
  linkCard: {
    backgroundColor: theme.colors.white,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: theme.colors.gray[200],
    overflow: 'hidden',
  },
  linkItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray[200],
  },
  linkText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: theme.colors.gray[800],
  },
  versionText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: theme.colors.gray[500],
    textAlign: 'center',
    marginTop: 8,
  },
});