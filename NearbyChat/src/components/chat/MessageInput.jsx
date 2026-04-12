import React from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function MessageInput({ value, onChange, onSend }) {
  return (
    <View style={styles.row}>
      <TextInput
        style={styles.input}
        placeholder="Message..."
        placeholderTextColor="#666"
        value={value}
        onChangeText={onChange}
        multiline
        maxLength={500}
      />
      <TouchableOpacity
        style={[styles.btn, !value.trim() && styles.btnDisabled]}
        onPress={onSend}
        disabled={!value.trim()}
      >
        <Text style={styles.icon}>send</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-end', gap: 10, padding: 12, backgroundColor: '#1A1A1A', borderTopWidth: 1, borderTopColor: '#2A2A2A' },
  input: { flex: 1, backgroundColor: '#2A2A2A', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 10, color: '#fff', fontSize: 15, maxHeight: 100 },
  btn: { backgroundColor: '#FF6B6B', borderRadius: 22, width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  btnDisabled: { backgroundColor: '#3A3A3A' },
  icon: { color: '#fff', fontSize: 14, fontWeight: '700' },
});