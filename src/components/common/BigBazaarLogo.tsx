import React from 'react';
import { View, Image, StyleSheet, ViewStyle, StyleProp } from 'react-native';

interface BigBazaarLogoProps {
  size?: 'small' | 'medium' | 'large';
  showTagline?: boolean; // Ignored for image logo
  style?: StyleProp<ViewStyle>;
}

export const BigBazaarLogo: React.FC<BigBazaarLogoProps> = ({
  size = 'large',
  style,
}) => {
  const imageSize = size === 'small' ? 40 : size === 'medium' ? 80 : 160;

  return (
    <View style={[styles.container, style]}>
      <Image 
        source={require('../../assets/images/my-big-bazzar-logo.png')} 
        style={{ width: imageSize, height: imageSize }} 
        resizeMode="contain" 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default BigBazaarLogo;
