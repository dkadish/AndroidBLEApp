import React, { useEffect } from 'react';
import { Platform, PermissionsAndroid, Alert } from 'react-native';
import { check, request, PERMISSIONS, RESULTS, openSettings } from 'react-native-permissions';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import BLEScreen from './screens/BLEScreen';
import DataDisplay from './screens/DataDisplay';
import { BLEProvider } from './BLEUniversal';

const Stack = createNativeStackNavigator();

async function requestLocationPermissions() {
  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );

      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        Alert.alert(
          'Permission required',
          'Please enable Location permission in Settings for GPS tracking.'
        );
      } else {
        console.log('✅ Android: Location permission granted.');
      }
    } catch (err) {
      console.error('Android permission request error:', err);
    }
  } else if (Platform.OS === 'ios') {
    try {
      // Check and request “Always” permission for background GPS
      let location = await check(PERMISSIONS.IOS.LOCATION_ALWAYS);

      if (location !== RESULTS.GRANTED) {
        const foreground = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
        if (foreground === RESULTS.GRANTED) {
          location = await request(PERMISSIONS.IOS.LOCATION_ALWAYS);
        }
      }

      if (location !== RESULTS.GRANTED) {
        Alert.alert(
          'Permissions required',
          'To record data in the background, please enable "Always Allow" for Location in Settings.',
          [
            { text: 'Open Settings', onPress: () => openSettings() },
            { text: 'Cancel', style: 'cancel' },
          ]
        );
      } else {
        console.log('✅ iOS: Location permission granted.');
      }
    } catch (err) {
      console.error('iOS permission request error:', err);
    }
  }
}

export default function App() {
  useEffect(() => {
    requestLocationPermissions();
  }, []);

  return (
    <BLEProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Device" component={BLEScreen} />
          <Stack.Screen name="Data Display" component={DataDisplay} />
        </Stack.Navigator>
      </NavigationContainer>
    </BLEProvider>
  );
}
