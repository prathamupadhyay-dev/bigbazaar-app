import React, { useEffect } from 'react';
import { View, StyleSheet, Image, Dimensions } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import ScreenContainer from '../components/ScreenContainer';
import Colors from '../constants/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'Welcome'>;

const { width } = Dimensions.get('window');

export default function WelcomeScreen({ navigation }: Props) {
  useEffect(() => {
    // Navigate to Main after 2.5 seconds
    const timer = setTimeout(() => {
      navigation.replace('Main');
    }, 2500);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <ScreenContainer style={styles.container}>
      <View style={styles.content}>
        <Image 
          source={require('../assets/images/client-logo.png')} 
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF', // Clean white background for the logo
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: width * 0.8,
    height: width * 0.8, // Make it large enough
  },
});
