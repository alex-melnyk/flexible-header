import { Animated, Dimensions, ScrollView, Text, TouchableWithoutFeedback } from 'react-native';
import React from 'react';
import { Images } from '../assets';

const {
  width: screenWidth,
  height: screenHeight
} = Dimensions.get('screen');

type Props = {
  data: {
    image: string;
    label: string;
  };
  animatedValue: Animated.Value;
  beginPoint: number;
  visible?: boolean;
  onDismiss: () => void;
};

export const ItemDetails: React.FC<Props> = ({ data, animatedValue, beginPoint, visible, onDismiss }) => {
  const overlayTop = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [beginPoint, 0]
  });

  const overlayOpacity = animatedValue.interpolate({
    inputRange: [0, 0.25, 1],
    outputRange: [0, 1, 1]
  });

  const overlaySize = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [200, screenHeight]
  });

  const horizontalPadding = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [10, 0]
  });

  const imageRadius = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [10, 0]
  });

  return (visible && data) && (
    <Animated.View style={{
      position: 'absolute',
      left: 0,
      top: overlayTop,
      width: '100%',
      height: overlaySize,
      opacity: overlayOpacity
    }}>
      <Animated.View
        style={{
          marginHorizontal: horizontalPadding,
          flex: 1,
          borderRadius: imageRadius,
          overflow: 'hidden',
          backgroundColor: '#FFFFFF'
        }}
      >
        <ScrollView>
          <TouchableWithoutFeedback
            onPress={() => onDismiss()}
          >
            <Animated.Image
              style={{
                width: '100%',
                height: 200,
                resizeMode: 'cover',
              }}
              source={Images[data.image]}
            />
          </TouchableWithoutFeedback>
          <Text style={{
            padding: 20,
            fontSize: 40,
            fontWeight: '800'
          }}>
            {data.label}
          </Text>
          <Text style={{
            padding: 20,
            paddingTop: 0,
            fontSize: 22,
            textAlign: 'left'
          }}>
            Fusce molestie ultrices metus. Quisque convallis nunc eget dolor vehicula commodo. Quisque eu fermentum
            lacus, ornare rutrum tellus. Fusce vel dui scelerisque quam tincidunt dapibus vel ac quam. Orci varius
            natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Sed ultricies arcu eget lacus
            sollicitudin tempor. Duis ac ex elementum, tempor lorem quis, fringilla nisl.
            {'\n\n'}
            Pellentesque rutrum quam vel nisl sollicitudin, in dictum nibh consequat. Phasellus eget consequat metus.
            Sed sagittis imperdiet diam, vitae pharetra felis laoreet in. Nunc ullamcorper vestibulum turpis vitae
            laoreet. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.
            Suspendisse sed eros iaculis, lobortis nunc sit amet, tempus velit. Aliquam enim arcu, placerat et imperdiet
            eu, pretium a ante. Curabitur fringilla nisi non egestas convallis. Fusce vel eleifend nulla. Phasellus ac
            egestas elit. Ut id tellus libero. Sed scelerisque at quam vel finibus. Duis quis massa diam. Pellentesque
            vulputate quis odio sed rhoncus. Sed vel libero mauris. Curabitur nec nulla in enim facilisis volutpat id eu
            metus.
          </Text>
        </ScrollView>
      </Animated.View>
    </Animated.View>
  );
};
