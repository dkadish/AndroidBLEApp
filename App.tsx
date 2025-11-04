import React from 'react';
import { View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import BLEScreen from './screens/BLEScreen';
import DataDisplay from './screens/DataDisplay';
import { BLEProvider } from './BLEUniversal';
import MiniMapOverlay from './components/MiniMapOverlay';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <BLEProvider>
      <View style={styles.container}>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Home"
            screenOptions={{ headerShown: false }}
          >
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Device" component={BLEScreen} />
            <Stack.Screen name="Data Display" component={DataDisplay} />
          </Stack.Navigator>
        </NavigationContainer>

        {/* 🌍 Always-visible mini map overlay */}
        <MiniMapOverlay />
      </View>
    </BLEProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
