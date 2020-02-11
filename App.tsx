import React, { useRef } from 'react';
import {
  Animated,
  Dimensions,
  ImageBackground,
  NativeScrollEvent,
  NativeSyntheticEvent,
  SafeAreaView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import Mountains from './src/data/mountains.json';
import { Images } from './src/assets';

const {
  width: screenWidth,
  height: screenHeight
} = Dimensions.get('screen');

const HEADER_MIN_HEIGHT = 80;
const HEADER_MAX_HEIGHT = screenHeight / 3;
const HEADER_MAX_INTERPOLATE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

export default function App() {
  const headerAnimated = useRef(new Animated.Value(0)).current;

  const handleScrollBegin = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { nativeEvent: { contentOffset } } = e;
    headerAnimated.setValue(contentOffset.y);
  };

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
          <View style={styles.item}>
            <ImageBackground
              style={styles.itemBackgroundImage}
              source={Images[item.image]}
            >
              <View style={styles.itemContent}>
                <Text style={styles.itemLabel}>
                  {item.label}
                </Text>
              </View>
            </ImageBackground>
          </View>
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
              Where to go hiking
            </Animated.Text>
          </SafeAreaView>
        </Animated.View>
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
  },
  item: {
    margin: 10,
    marginBottom: 0,
    height: 200,
    borderRadius: 10,
    backgroundColor: '#434343',
    overflow: 'hidden'
  },
  itemBackgroundImage: {
    width: '100%',
    height: '100%'
  },
  itemContent: {
    padding: 20,
    flex: 1,
    justifyContent: 'flex-end'
  },
  itemLabel: {
    fontSize: 26,
    fontWeight: '800',
    color: '#F6F7EB'
  }
});
