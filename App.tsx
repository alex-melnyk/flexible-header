import React, { useCallback, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import Mountains from './src/data/mountains.json';
import { ListItem } from './src/components';

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

  const handleScrollBegin = useCallback((e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { nativeEvent: { contentOffset } } = e;
    headerAnimated.setValue(contentOffset.y);
  }, [headerAnimated]);

  const handleListItemPress = useCallback((location: number, item: { image: string; label: string; }) => {
    setOverlayLocation(location);

    Animated.timing(overlayAnimated, {
      toValue: 1,
      duration: 300,
    }).start();
  }, [overlayAnimated]);

  const overlayTop = overlayAnimated.interpolate({
    inputRange: [0, 1],
    outputRange: [overlayLocation, 0]
  });

  const overlaySize = overlayAnimated.interpolate({
    inputRange: [0, 1],
    outputRange: [200, screenHeight]
  });

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

  const reverseHeight = headerAnimated.interpolate({
    inputRange: [0, HEADER_MAX_INTERPOLATE],
    outputRange: [0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
    extrapolate: 'clamp'
  });

  const offsetHeight = headerAnimated.interpolate({
    inputRange: [0, HEADER_MAX_INTERPOLATE],
    outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
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
        style={{
          marginTop: offsetHeight
        }}
        contentContainerStyle={styles.list}
        ListHeaderComponent={(
          <Animated.View style={{ height: reverseHeight }}/>
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
      <Animated.View style={{
        position: 'absolute',
        left: 0,
        top: overlayTop,
        width: '100%',
        height: overlaySize,
      }}>
        <TouchableOpacity
          style={{
            flex: 1,
            backgroundColor: 'red'
          }}
          onPress={() => overlayAnimated.setValue(0)}
        >

        </TouchableOpacity>
      </Animated.View>
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
