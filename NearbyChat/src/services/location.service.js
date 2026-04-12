import * as Location from 'expo-location';

let watcherId = null;

export const locationService = {
  async requestPermission() {
    const { status } = await Location.requestForegroundPermissionsAsync();
    return status === 'granted';
  },

  async getCurrentPosition() {
    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });
    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };
  },

  async startWatching(onUpdate) {
    watcherId = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.Balanced,
        timeInterval: 10000,   // every 10s
        distanceInterval: 20,  // or every 20m
      },
      (location) => {
        onUpdate({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      }
    );
  },

  stopWatching() {
    if (watcherId) {
      watcherId.remove();
      watcherId = null;
    }
  },
};

export default locationService;
