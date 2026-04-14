import React from 'react';
import { Polygon } from 'react-native-maps';

export default function ZoneOverlay({ zone, onPress }) {
  return (
    <Polygon
      coordinates={zone.coordinates}
      fillColor={zone.color + '55'}
      strokeColor={zone.color}
      strokeWidth={2}
      tappable
      onPress={() => onPress(zone)}
    />
  );
}