import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function UserCount({ count, color }) {
  return (
    <View style={styles.container}>
      <View style={[styles.dot, { backgroundColor: color || '#FF6B6B' }]} />
      <Text style={styles.text}>{count} en ligne</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  text: { color: '#888', fontSize: 12 },
});