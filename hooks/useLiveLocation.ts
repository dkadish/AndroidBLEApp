import { useState, useEffect } from 'react';
import Geolocation from 'react-native-geolocation-service';

export default function useLiveLocation() {
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  useEffect(() => {
    const watchId = Geolocation.watchPosition(
      (pos) => {
        setLocation({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        });
      },
      (error) => {
        console.error('Location error:', error);
      },
      {
        enableHighAccuracy: true,
        distanceFilter: 0,
        interval: 2000,
      }
    );

    return () => {
      if (watchId !== null) {Geolocation.clearWatch(watchId);}
    };
  }, []);

  return location;
}
