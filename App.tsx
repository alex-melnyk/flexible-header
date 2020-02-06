import React, { ReactElement, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  View
} from 'react-native';
import BGImage from './assets/img/bg.jpg';

const {
  width: screenWidth
} = Dimensions.get('screen');

const HEADER_MIN_HEIGHT = 120;
const HEADER_MAX_HEIGHT = 300;

export default function App() {
  const headerAnimated = useRef(new Animated.Value(0)).current;
  const [momentum, setMomentum] = useState(false);
  const flatListRef = useRef<{ getNode: () => FlatList<ReactElement> }>();

  const handleScrollBegin = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { nativeEvent: { contentOffset } } = e;

    e.stopPropagation();
    // console.log('contentOffset.y', contentOffset.y);
    headerAnimated.setValue(contentOffset.y);
  };

  const resolveScrollPosition = (y: number) => {
    const flatList = flatListRef.current.getNode();
    console.log('flatListRef.current', y);

    if (y < (HEADER_MAX_HEIGHT / 2)) {
      flatList.scrollToOffset({
        animated: true,
        offset: y < (HEADER_MAX_HEIGHT / 2) ? 0 : 0
      });
    }
  };

  const headerHeight = headerAnimated.interpolate({
    inputRange: [-HEADER_MIN_HEIGHT, 0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
    outputRange: [HEADER_MAX_HEIGHT + HEADER_MIN_HEIGHT, HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
    extrapolate: 'clamp'
  });

  const reverseHeight = headerAnimated.interpolate({
    inputRange: [0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
    outputRange: [0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
    extrapolate: 'clamp'
  });

  const offsetHeight = headerAnimated.interpolate({
    inputRange: [0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
    outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
    extrapolate: 'clamp'
  });

  return (
    <View style={styles.container}>
      <Animated.FlatList
        ref={flatListRef}
        style={{
          marginTop: offsetHeight
        }}
        ListHeaderComponent={(
          <Animated.View style={{ height: reverseHeight }}/>
        )}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        data={[...new Array(10)]}
        keyExtractor={(v, i) => `card_${i}`}
        renderItem={({ item, index: i }) => (
          <View
            style={{
              margin: 10,
              height: 150,
              borderRadius: 8,
              backgroundColor: '#3E2F5B'
            }}
          />
        )}
        onScroll={handleScrollBegin}
        onMomentumScrollBegin={() => setMomentum(true)}
        onMomentumScrollEnd={({ nativeEvent: { contentOffset: { y } } }) => {
          resolveScrollPosition(y);
          setMomentum(false);
        }}
        onScrollDragEnd={({ nativeEvent: { contentOffset: { y } } }) => {
          if (!momentum) {
            resolveScrollPosition(y);
          }
        }}
      />
      <Animated.View
        style={{
          position: 'absolute',
          height: headerHeight
        }}
      >
        <Animated.Image
          source={BGImage}
          style={{
            height: headerHeight,
            width: screenWidth,
            resizeMode: 'cover'
          }}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
});
