import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function MessageBubble({ message }) {
  const { username, text, createdAt, isOwn } = message;
  return (
    <View style={[styles.wrapper, isOwn ? styles.wrapperOwn : styles.wrapperOther]}>
      {!isOwn && <Text style={styles.username}>{username}</Text>}
      <View style={[styles.bubble, isOwn ? styles.bubbleOwn : styles.bubbleOther]}>
        <Text style={styles.text}>{text}</Text>
        <Text style={styles.time}>{new Date(createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginVertical: 3, maxWidth: '80%' },
  wrapperOwn: { alignSelf: 'flex-end', alignItems: 'flex-end' },
  wrapperOther: { alignSelf: 'flex-start', alignItems: 'flex-start' },
  username: { color: '#FF6B6B', fontSize: 11, fontWeight: '700', marginBottom: 3, marginLeft: 4 },
  bubble: { borderRadius: 16, paddingHorizontal: 14, paddingVertical: 10 },
  bubbleOwn: { backgroundColor: '#FF6B6B', borderBottomRightRadius: 4 },
  bubbleOther: { backgroundColor: '#1E1E1E', borderBottomLeftRadius: 4 },
  text: { color: '#fff', fontSize: 15, lineHeight: 20 },
  time: { color: 'rgba(255,255,255,0.45)', fontSize: 10, marginTop: 4, textAlign: 'right' },
});