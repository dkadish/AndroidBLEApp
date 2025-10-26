import React from 'react';
import { StyleSheet, View } from 'react-native';
import { MapView, Camera, ShapeSource, CircleLayer } from '@maplibre/maplibre-react-native';

type LiveLocationMapProps = {
  coordinates: { latitude: number; longitude: number } | null;
};

export default function LiveLocationMap({ coordinates }: LiveLocationMapProps) {
  return (
    <View style={styles.container}>
      <MapView
        key={`${coordinates?.latitude}-${coordinates?.longitude}`}
        style={styles.map}
        mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
      >
        {coordinates && (
          <>
            <Camera
              key={`${coordinates.latitude}-${coordinates.longitude}`}
              centerCoordinate={[coordinates.longitude, coordinates.latitude]}
              zoomLevel={15}
              animationMode="flyTo"
              animationDuration={1000}
            />
            <ShapeSource
              id="user-location"
              shape={{
                type: 'FeatureCollection',
                features: [
                  {
                    type: 'Feature',
                    geometry: {
                      type: 'Point',
                      coordinates: [coordinates.longitude, coordinates.latitude],
                    },
                  },
                ],
              }}
            >
              <CircleLayer
                id="user-point"
                style={{
                  circleColor: '#00a6ffff',
                  circleRadius: 6,
                  circleStrokeWidth: 2,
                  circleStrokeColor: '#ffffff',
                }}
              />
            </ShapeSource>
          </>
        )}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
});
