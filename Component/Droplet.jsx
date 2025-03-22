import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { View } from 'react-native';

const Droplet = ({ size = 32, color = '#FF4D4D', children }) => {
  return (
    <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
      <Svg width={size} height={size} viewBox="0 0 32 32">
        <Path
          d="M16 2 C16 2 7 15 7 22 C7 27.5 11.5 32 16 32 C20.5 32 25 27.5 25 22 C25 15 16 2 16 2"
          fill={color}
        />
      </Svg>
      <View style={{ position: 'absolute' }}>
        {children}
      </View>
    </View>
  );
};

export default Droplet; 