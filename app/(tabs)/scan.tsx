import { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, Platform, Image } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { theme } from '@/constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImageManipulator from 'expo-image-manipulator';
import { detectPlantDisease } from '@/services/openaiService';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

export default function ScanScreen() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const cameraRef = useRef<CameraView | null>(null);
  const router = useRouter();
  const { gallery } = useLocalSearchParams();

  useEffect(() => {
    if (gallery === 'true') {
      pickImage();
    }
  }, [gallery]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setCapturedImage(result.assets[0].uri);
      // Reset any previous results or errors
      setAnalysisResult(null);
      setError(null);
    }
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync();
        setCapturedImage(photo.uri);
        setAnalysisResult(null);
        setError(null);
      } catch (e) {
        console.error('Error taking picture:', e);
      }
    }
  };

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  const resetCapture = () => {
    setCapturedImage(null);
    setAnalysisResult(null);
    setError(null);
  };

  const analyzeImage = async () => {
    if (!capturedImage) return;
    
    setIsAnalyzing(true);
    setError(null);
    
    try {
      // Resize image to reduce file size for API upload
      const manipResult = await ImageManipulator.manipulateAsync(
        capturedImage,
        [{ resize: { width: 800 } }],
        { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
      );
      
      const result = await detectPlantDisease(manipResult.uri);
      setAnalysisResult(result);
    } catch (err: any) {
      setError(err.message || 'An error occurred during analysis. Please try again.');
      console.error('Error analyzing image:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (!permission) {
    // Camera permissions are still loading
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={theme.colors.primary[600]} />
      </View>
    );
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <SafeAreaView style={styles.permissionContainer}>
        <Text style={styles.permissionTitle}>Camera Access Needed</Text>
        <Text style={styles.permissionText}>
          We need camera permission to scan plant leaves for disease detection.
        </Text>
        <TouchableOpacity 
          style={styles.permissionButton} 
          onPress={requestPermission}>
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  if (capturedImage) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.previewContainer}>
          <Image source={{ uri: capturedImage }} style={styles.previewImage} />
          
          {!isAnalyzing && !analysisResult && !error && (
            <View style={styles.previewOverlay}>
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.7)']}
                style={styles.gradient}
              />
              <View style={styles.previewActions}>
                <TouchableOpacity 
                  style={[styles.previewButton, styles.secondaryButton]} 
                  onPress={resetCapture}>
                  <Feather name='x' size={20} color={theme.colors.white} />
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.previewButton, styles.primaryButton]} 
                  onPress={analyzeImage}>
                  <Text style={styles.previewButtonText}>Analyze</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          
          {isAnalyzing && (
            <Animated.View 
              entering={FadeIn}
              exiting={FadeOut}
              style={styles.analysingOverlay}>
              <View style={styles.analysingContent}>
                <ActivityIndicator size="large" color={theme.colors.white} />
                <Text style={styles.analysingText}>Analyzing your plant...</Text>
                <Text style={styles.analysingSubtext}>This may take a moment</Text>
              </View>
            </Animated.View>
          )}
          
          {analysisResult && (
            <Animated.View 
              entering={FadeIn}
              style={styles.resultOverlay}>
              <View style={styles.resultContainer}>
                <Text style={styles.resultTitle}>{analysisResult.isPlant ? 'Analysis Complete' : 'Not a Plant'}</Text>
                
                {analysisResult.isPlant ? (
                  <>
                    {analysisResult.disease ? (
                      <>
                        <Text style={styles.resultLabel}>Detected Issue:</Text>
                        <Text style={styles.resultDisease}>{analysisResult.disease}</Text>
                        
                        <Text style={styles.resultLabel}>Description:</Text>
                        <Text style={styles.resultDescription}>{analysisResult.description}</Text>
                        
                        <Text style={styles.resultLabel}>Treatment:</Text>
                        <Text style={styles.resultDescription}>{analysisResult.treatment}</Text>
                      </>
                    ) : (
                      <Text style={styles.resultHealthy}>Your plant appears healthy!</Text>
                    )}
                  </>
                ) : (
                  <Text style={styles.resultDescription}>
                    The image does not appear to contain a plant or leaf. Please take a clear photo of a plant or leaf for analysis.
                  </Text>
                )}
                
                <View style={styles.resultActions}>
                  <TouchableOpacity 
                    style={[styles.resultButton, styles.secondaryResultButton]} 
                    onPress={resetCapture}>
                    <Feather name='refresh-cw' size={16} color={theme.colors.primary[600]} />
                    <Text style={styles.secondaryResultButtonText}>Scan Again</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Animated.View>
          )}
          
          {error && (
            <View style={styles.errorOverlay}>
              <View style={styles.errorContainer}>
                <Text style={styles.errorTitle}>Analysis Error</Text>
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity 
                  style={styles.errorButton} 
                  onPress={resetCapture}>
                  <Text style={styles.errorButtonText}>Try Again</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing={facing}
        ratio="16:9"
      />
      {/* Overlay UI absolutely positioned on top of CameraView */}
      <SafeAreaView style={[styles.cameraOverlay, { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }]}> 
        <View style={styles.cameraHeader}>
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={() => router.back()}>
            <Feather name='x' size={24} color={theme.colors.white} />
          </TouchableOpacity>
          <Text style={styles.cameraTitle}>Plant Scan</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.cameraGuide}>
          <View style={styles.cameraGuideBox} />
        </View>
        <Text style={styles.cameraGuideText}>
          Position the plant leaf in the frame
        </Text>
        {/* Camera Controls */}
        <View style={styles.cameraControls}>
          <TouchableOpacity style={styles.galleryButton} onPress={pickImage}>
            <Feather name="image" size={28} color={theme.colors.white} />
          </TouchableOpacity>
          <View style={{ width: 24 }} />
          <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
            <View style={styles.captureButtonInner} />
          </TouchableOpacity>
          <View style={{ width: 24 }} />
          <TouchableOpacity style={styles.flipButton} onPress={toggleCameraFacing}>
            <Feather name="refresh-cw" size={28} color={theme.colors.white} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.black,
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'space-between',
  },
  cameraHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraTitle: {
    fontFamily: 'Inter-SemiBold',
    color: theme.colors.white,
    fontSize: 18,
  },
  cameraGuide: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraGuideBox: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: theme.colors.white,
    borderRadius: 8,
    marginBottom: 12,
  },
  cameraGuideText: {
    fontFamily: 'Inter-Regular',
    color: theme.colors.white,
    fontSize: 14,
    textAlign: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  cameraControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: 32,
  },
  galleryButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.white,
  },
  flipButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    backgroundColor: theme.colors.white,
  },
  permissionTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 24,
    color: theme.colors.gray[800],
    marginBottom: 16,
    textAlign: 'center',
  },
  permissionText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: theme.colors.gray[600],
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 24,
  },
  permissionButton: {
    backgroundColor: theme.colors.primary[600],
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  permissionButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: theme.colors.white,
  },
  previewContainer: {
    flex: 1,
    position: 'relative',
  },
  previewImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  previewOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 160,
  },
  previewActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 16,
  },
  previewButton: {
    flex: 1,
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  secondaryButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  primaryButton: {
    backgroundColor: theme.colors.primary[600],
    flex: 2,
  },
  previewButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: theme.colors.white,
  },
  analysingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  analysingContent: {
    alignItems: 'center',
  },
  analysingText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: theme.colors.white,
    marginTop: 24,
    marginBottom: 8,
  },
  analysingSubtext: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: theme.colors.gray[300],
  },
  resultOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  resultContainer: {
    backgroundColor: theme.colors.white,
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxHeight: '80%',
  },
  resultTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 20,
    color: theme.colors.gray[800],
    marginBottom: 16,
    textAlign: 'center',
  },
  resultLabel: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: theme.colors.gray[700],
    marginBottom: 4,
    marginTop: 16,
  },
  resultDisease: {
    fontFamily: 'Inter-Medium',
    fontSize: 18,
    color: theme.colors.error[600],
    marginBottom: 4,
  },
  resultHealthy: {
    fontFamily: 'Inter-Medium',
    fontSize: 18,
    color: theme.colors.success[600],
    marginTop: 8,
    marginBottom: 16,
    textAlign: 'center',
  },
  resultDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 15,
    color: theme.colors.gray[600],
    lineHeight: 22,
  },
  resultActions: {
    marginTop: 24,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  resultButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  secondaryResultButton: {
    backgroundColor: theme.colors.primary[50],
    borderWidth: 1,
    borderColor: theme.colors.primary[600],
  },
  secondaryResultButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: theme.colors.primary[600],
  },
  errorOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorContainer: {
    backgroundColor: theme.colors.white,
    borderRadius: 16,
    padding: 24,
    width: '100%',
    alignItems: 'center',
  },
  errorTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 20,
    color: theme.colors.error[600],
    marginBottom: 12,
  },
  errorText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: theme.colors.gray[700],
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 22,
  },
  errorButton: {
    backgroundColor: theme.colors.primary[600],
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  errorButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: theme.colors.white,
  },
});