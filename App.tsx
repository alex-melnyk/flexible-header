import React, { useCallback, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  SafeAreaView,
  StyleSheet,
  View
} from 'react-native';
import Mountains from './src/data/mountains.json';
import { ListItem } from './src/components';
import { ItemDetails } from './src/components/ItemDetails';

type Item = {
  image: string;
  label: string;
};

const {
  width: screenWidth,
  height: screenHeight
} = Dimensions.get('screen');

const HEADER_MIN_HEIGHT = 80;
const HEADER_MAX_HEIGHT = screenHeight / 3;
const HEADER_MAX_INTERPOLATE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

export default function App() {
  const flatListRef = useRef<{ getNode: () => FlatList<typeof ListItem> }>();
  const headerAnimated = useRef(new Animated.Value(0)).current;
  const overlayAnimated = useRef(new Animated.Value(0)).current;
  const [overlayLocation, setOverlayLocation] = useState(0);
  const [selectedItem, setSelectedItem] = useState<Item>();

  const handleScrollBegin = useCallback((e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { nativeEvent: { contentOffset } } = e;
    headerAnimated.setValue(contentOffset.y);
  }, [headerAnimated]);

  const handleListItemPress = useCallback((location: number, item: Item) => {
    setSelectedItem(item);
    setOverlayLocation(location);

    Animated.timing(overlayAnimated, {
      delay: 150,
      toValue: 1,
      duration: 300,
    }).start();
  }, [overlayAnimated]);

  const handleDismissItem = useCallback(() => {
    Animated.timing(overlayAnimated, {
      toValue: 0,
      duration: 150,
    }).start(() => setSelectedItem(undefined));
  }, []);

  const headerHeight = headerAnimated.interpolate({
    inputRange: [-HEADER_MIN_HEIGHT, 0, HEADER_MAX_INTERPOLATE],
    outputRange: [HEADER_MAX_HEIGHT + HEADER_MIN_HEIGHT, HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
    extrapolate: 'clamp'
  });

  const headerBg = headerAnimated.interpolate({
    inputRange: [0, HEADER_MAX_INTERPOLATE],
    outputRange: ['#393E4100', '#393E419B'],
    extrapolate: 'clamp'
  });

  const titleSize = headerAnimated.interpolate({
    inputRange: [0, HEADER_MAX_INTERPOLATE],
    outputRange: [28, 22],
    extrapolate: 'clamp'
  });

  return (
    <View style={styles.container}>
      <Animated.FlatList
        ref={flatListRef}
        contentContainerStyle={styles.list}
        ListHeaderComponent={(
          <Animated.View style={{ height: HEADER_MAX_HEIGHT }}/>
        )}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        data={Mountains}
        keyExtractor={(v, i) => `card_${i}`}
        renderItem={({ item }) => (
          <ListItem
            image={item.image}
            label={item.label}
            onPress={(location) => handleListItemPress(location, item)}
          />
        )}
        onScroll={handleScrollBegin}
      />
      <Animated.View
        style={[styles.headerContainer, {
          height: headerHeight
        }]}
      >
        <Animated.Image
          source={require('./assets/img/bg.jpg')}
          style={[styles.headerBackgroundImage, {
            height: headerHeight
          }]}
        />
        <Animated.View
          style={[styles.headerContentWrapper, {
            backgroundColor: headerBg
          }]}
        >
          <SafeAreaView
            style={styles.headerContentContainer}
          >
            <Animated.Text
              style={[styles.headerContentTitle, {
                fontSize: titleSize
              }]}
            >
              Mountains Hiking
            </Animated.Text>
          </SafeAreaView>
        </Animated.View>
      </Animated.View>
      <ItemDetails
        data={selectedItem}
        animatedValue={overlayAnimated}
        beginPoint={overlayLocation}
        visible={!!selectedItem}
        onDismiss={handleDismissItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  list: {
    // flexGrow: 1,
    paddingBottom: 10,
  },
  headerContainer: {
    position: 'absolute',
    width: '100%'
  },
  headerBackgroundImage: {
    position: 'absolute',
    width: screenWidth,
    resizeMode: 'cover',
  },
  headerContentContainer: {
    flex: 1,
    justifyContent: 'flex-end'
  },
  headerContentWrapper: {
    padding: 20,
    flex: 1
  },
  headerContentTitle: {
    fontWeight: '800',
    textTransform: 'uppercase',
    color: '#F6F7EB'
  }
});
