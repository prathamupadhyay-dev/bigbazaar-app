import React from 'react';
import { StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { SafeAreaView, Edge } from 'react-native-safe-area-context';
import Colors from '../constants/colors';
import Spacing from '../constants/spacing';








export const ScreenContainer = ({
  children,
  style,
  edges = ['top', 'left', 'right'],
  noPadding = false
}) => {
  return (
    <SafeAreaView
      edges={edges}
      style={[
      styles.container,
      !noPadding && styles.horizontalPadding,
      style]
      }>
      
      {children}
    </SafeAreaView>);

};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background
  },
  horizontalPadding: {
    paddingHorizontal: Spacing.md
  }
});

export default ScreenContainer;