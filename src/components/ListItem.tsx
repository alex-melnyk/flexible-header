import React, { useCallback, useRef, useState } from 'react';
import { Animated, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Images } from '../assets';

type Props = {
  image: string;
  label: string;
  onPress: (location: number) => void;
};

export const ListItem: React.FC<Props> = ({ image, label, onPress }) => {
  const selfRef = useRef<{ getNode: () => View }>();

  const handlePress = useCallback(() => {
    selfRef.current.getNode().measure((x, y, width, height, pageX, pageY) => {
      onPress(pageY);
    });
  }, [selfRef]);

  return (
    <Animated.View
      ref={selfRef}
      style={styles.item}
    >
      <TouchableOpacity
        onPress={handlePress}
      >
        <ImageBackground
          style={styles.itemBackgroundImage}
          source={Images[image]}
        >
          <View style={styles.itemContent}>
            <Text style={styles.itemLabel}>
              {label}
            </Text>
          </View>
        </ImageBackground>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  item: {
    position: 'relative',
    top: 0,
    margin: 10,
    marginBottom: 0,
    height: 200,
    borderRadius: 10,
    backgroundColor: '#434343',
    overflow: 'hidden',
    zIndex: 9
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
