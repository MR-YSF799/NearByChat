import { create } from 'zustand';

const useChatStore = create((set) => ({
  messages: [],
  typingUser: null,
  status: 'idle', // idle | connecting | connected | disconnected

  setMessages: (messages) => set({ messages }),
  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),
  setTypingUser: (username) => set({ typingUser: username }),
  setStatus: (status) => set({ status }),
  clearChat: () => set({ messages: [], typingUser: null }),
}));

export default useChatStore;
