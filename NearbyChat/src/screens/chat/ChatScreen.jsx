import React, { useState, useEffect, useRef } from 'react';
import { View, FlatList, Text, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import MessageBubble from '../../components/chat/MessageBubble';
import MessageInput from '../../components/chat/MessageInput';
import TypingIndicator from '../../components/chat/TypingIndicator';
import UserCount from '../../components/common/UserCount';
import useChatStore from '../../store/chatStore';
import useZoneStore from '../../store/zoneStore';
import useAuthStore from '../../store/authStore';
import { MOCK_MESSAGES, MOCK_TYPING_USER } from '../../mock/mockData';

// MOCK MODE
// Quand backend pret, remplacer useEffect par :
//   setMessages((await getMessages(currentZone.id)).data)
//   socketService.on('newMessage', msg => addMessage(msg))
//   socketService.on('userTyping', ({username}) => setTypingUser(username))
//   socketService.on('userJoined', ({userCount}) => setUserCount(userCount))
// Et handleSend : socketService.emit('sendMessage', { text: input })

export default function ChatScreen() {
  const [input, setInput] = useState('');
  const flatListRef = useRef(null);
  const { messages, setMessages, addMessage, typingUser, setTypingUser } = useChatStore();
  const { currentZone, userCount } = useZoneStore();
  const { user } = useAuthStore();

  useEffect(() => {
    setMessages(MOCK_MESSAGES);
    const t1 = setTimeout(() => setTypingUser(MOCK_TYPING_USER), 2000);
    const t2 = setTimeout(() => setTypingUser(null), 5000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const handleSend = () => {
    if (!input.trim()) return;
    addMessage({
      id: Date.now().toString(),
      username: user?.username || 'Moi',
      text: input.trim(),
      createdAt: new Date().toISOString(),
      isOwn: true,
    });
    setInput('');
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    // MOCK: simulate reply
    setTimeout(() => addMessage({
      id: (Date.now() + 1).toString(),
      username: 'Sara',
      text: 'OK ! 😄',
      createdAt: new Date().toISOString(),
      isOwn: false,
    }), 2500);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={88}
    >
      {/* Header */}
      <View style={styles.header}>
        {currentZone && <View style={[styles.headerDot, { backgroundColor: currentZone.color }]} />}
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>{currentZone?.name || 'Zone'}</Text>
        </View>
        <UserCount count={userCount || currentZone?.userCount || 0} color={currentZone?.color} />
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <MessageBubble message={item} />}
        contentContainerStyle={styles.list}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
      />

      {typingUser && <TypingIndicator username={typingUser} />}

      <MessageInput value={input} onChange={setInput} onSend={handleSend} />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D0D0D' },
  header: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: '#1A1A1A', padding: 16, paddingTop: 52,
    borderBottomWidth: 1, borderBottomColor: '#2A2A2A',
  },
  headerDot: { width: 12, height: 12, borderRadius: 6 },
  headerTitle: { color: '#fff', fontWeight: '700', fontSize: 16 },
  list: { padding: 16, gap: 8 },
});