import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { theme } from '@/constants/theme';
import { getHistoryItems, HistoryItem } from '@/services/historyService';
import { formatDate } from '@/utils/dateUtils';
import Animated, { FadeIn } from 'react-native-reanimated';

export default function HistoryScreen() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const items = await getHistoryItems();
      setHistory(items);
    } catch (error) {
      console.error('Error loading history:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderHistoryItem = ({ item }: { item: HistoryItem }) => (
    <Animated.View entering={FadeIn.duration(400)} style={styles.historyCard}>
      <Image source={{ uri: item.imageUri }} style={styles.historyImage} />
      <View style={styles.historyContent}>
        <View style={styles.historyHeader}>
          <Text style={styles.historyTitle}>
            {item.isPlant ? (item.disease || 'Healthy Plant') : 'Not a Plant'}
          </Text>
          {item.isPlant && item.disease && (
            <View style={styles.diseaseBadge}>
              <Text style={styles.diseaseBadgeText}>Disease</Text>
            </View>
          )}
          {item.isPlant && !item.disease && (
            <View style={styles.healthyBadge}>
              <Text style={styles.healthyBadgeText}>Healthy</Text>
            </View>
          )}
        </View>
        <View style={styles.timeContainer}>
          <Feather name="clock" size={14} color={theme.colors.gray[500]} />
          <Text style={styles.timeText}>{formatDate(item.timestamp)}</Text>
        </View>
        <TouchableOpacity style={styles.viewButton}>
          <Text style={styles.viewButtonText}>View Details</Text>
          <Feather name="chevron-right" size={16} color={theme.colors.primary[600]} />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Scan History</Text>
        <TouchableOpacity style={styles.refreshButton} onPress={loadHistory}>
          <Feather name="refresh-cw" size={20} color={theme.colors.primary[600]} />
        </TouchableOpacity>
      </View>

      {history.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Image
            source={{
              uri: 'https://images.pexels.com/photos/929382/pexels-photo-929382.jpeg',
            }}
            style={styles.emptyImage}
          />
          <Text style={styles.emptyTitle}>No History Yet</Text>
          <Text style={styles.emptyText}>
            Your plant scan history will appear here after you scan your first plant.
          </Text>
        </View>
      ) : (
        <FlatList
          data={history}
          renderItem={renderHistoryItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.historyList}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray[200],
  },
  title: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 24,
    color: theme.colors.gray[800],
  },
  refreshButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primary[50],
    justifyContent: 'center',
    alignItems: 'center',
  },
  historyList: {
    padding: 16,
  },
  historyCard: {
    backgroundColor: theme.colors.white,
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.colors.gray[200],
    flexDirection: 'row',
  },
  historyImage: {
    width: 100,
    height: 120,
  },
  historyContent: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  historyTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: theme.colors.gray[800],
    flex: 1,
  },
  diseaseBadge: {
    backgroundColor: theme.colors.error[50],
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginLeft: 8,
  },
  diseaseBadgeText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: theme.colors.error[600],
  },
  healthyBadge: {
    backgroundColor: theme.colors.success[50],
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginLeft: 8,
  },
  healthyBadgeText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: theme.colors.success[600],
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  timeText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: theme.colors.gray[500],
    marginLeft: 4,
  },
  viewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  viewButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: theme.colors.primary[600],
    marginRight: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginBottom: 24,
  },
  emptyTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 20,
    color: theme.colors.gray[800],
    marginBottom: 8,
  },
  emptyText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: theme.colors.gray[600],
    textAlign: 'center',
    lineHeight: 24,
  },
});
