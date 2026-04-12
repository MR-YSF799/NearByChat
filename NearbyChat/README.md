# NearbyChat — Frontend React Native

## Lancer le projet (Mock, sans backend)

```bash
npm install
npx expo start
```

## Structure

```
src/
├── mock/mockData.js          ← Toutes les données de test (modifier ici)
├── screens/
│   ├── auth/LoginScreen      ← Login avec mock
│   ├── auth/RegisterScreen   ← Register avec mock
│   ├── map/MapScreen         ← Carte + zones (polygones)
│   ├── chat/ChatScreen       ← Chat temps réel (mock messages)
│   └── profile/ProfileScreen ← Profil + déconnexion
├── store/
│   ├── authStore.js          ← user + token (Zustand)
│   ├── zoneStore.js          ← zones + zone courante
│   └── chatStore.js          ← messages + typing
├── services/
│   ├── api.service.js        ← Axios (prêt pour vrai backend)
│   ├── socket.service.js     ← Socket.IO (prêt pour vrai backend)
│   └── location.service.js   ← GPS via expo-location
└── navigation/               ← Stack + Tab navigators
```

## Connexion Backend (quand prêt)

### 1. Changer l'URL dans les services :
```js
// src/services/api.service.js
const BASE_URL = 'http://TON_IP:3000';

// src/services/socket.service.js
const SOCKET_URL = 'http://TON_IP:3000';
```

### 2. LoginScreen — remplacer le mock :
```js
// Avant (mock)
setTimeout(() => { setToken('mock-jwt-token'); setUser({...}); }, 800);

// Après (backend réel)
const res = await loginUser({ username, password });
setToken(res.data.token);
setUser(res.data.user);
```

### 3. ChatScreen — remplacer les mocks :
```js
// Charger l'historique
const res = await getMessages(currentZone.id);
setMessages(res.data);

// Écouter les nouveaux messages
socketService.on('newMessage', (msg) => addMessage(msg));
socketService.on('userTyping', ({ username }) => setTypingUser(username));

// Envoyer
socketService.emit('sendMessage', { text: input });
```

### 4. MapScreen — remplacer les mocks :
```js
// Charger les zones
const res = await getAllZones();
setAllZones(res.data);

// GPS + zone auto
locationService.startWatching((coords) => {
  socketService.emit('updateLocation', coords);
});
socketService.on('zoneAssigned', (zone) => setCurrentZone(zone));
```
