import 'react-native-reanimated';
import React from 'react';
import {View, Text, SafeAreaView, StyleSheet} from 'react-native';
import {useBLE} from '../BLEUniversal';
import {RadarChart} from '@salmonco/react-native-radar-chart';
import useLiveLocation from '../hooks/useLiveLocation';

const DataDisplay = () => {
  const {characteristicValues} = useBLE();
  const location = useLiveLocation();

  const methane = characteristicValues['..Methane'] || 0;
  const ammonia = characteristicValues['..Ammonia'] || 0;
  const formaldehyde = characteristicValues['..Formaldehyde'] || 0;
  const voc = characteristicValues['..Voletile Organic Compounds'] || 0;
  const odour = characteristicValues['..Odor'] || 0;
  const hydrogenSulfide = characteristicValues['..Hydrogen Sulfide'] || 0;
  const ethanol = characteristicValues['..Ethanol'] || 0;
  const nitrogenDioxide = characteristicValues['..Nitrogen Dioxide'] || 0;

  const radarData = [
    {label: 'Ch4', value: methane},
    {label: 'NH3', value: ammonia},
    {label: 'HCHO', value: formaldehyde},
    {label: 'VOC', value: voc},
    {label: 'Odour', value: odour},
    {label: 'H2S', value: hydrogenSulfide},
    {label: 'Etoh', value: ethanol},
    {label: 'No2', value: nitrogenDioxide},
  ].filter(item => !isNaN(item.value));

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Data Dashboard</Text>

      <RadarChart
        data={radarData}
        maxValue={1}
        gradientColor={{
          startColor: '#eae8e6ff',
          endColor: '#e9ded3ff',
          count: 5,
        }}
        stroke={['#FFE8D3']}
        strokeWidth={[1]}
        labelColor="#21a1b1ff"
        dataFillColor="#3dadd0ff"
        dataFillOpacity={0.8}
        dataStroke="salmon"
        dataStrokeWidth={2}
        isCircle
      />

      <View style={styles.values}>
        <Text>Methane: {methane.toFixed(2)}</Text>
        <Text>Ammonia: {ammonia.toFixed(2)}</Text>
        <Text>Formaldehyde: {formaldehyde.toFixed(2)}</Text>
        <Text>VOC: {voc.toFixed(2)}</Text>
        <Text>Odour: {odour.toFixed(2)}</Text>
        <Text>Hydrogen Sulfide: {hydrogenSulfide.toFixed(2)}</Text>
        <Text>Ethanol: {ethanol.toFixed(2)}</Text>
        <Text>Nitrogen Dioxide: {nitrogenDioxide.toFixed(2)}</Text>
      </View>

      {/* 👇 Live Location Section */}
      <View style={styles.locationContainer}>
        {location ? (
          <>
            <Text>Latitude: {location.latitude.toFixed(6)}</Text>
            <Text>Longitude: {location.longitude.toFixed(6)}</Text>
          </>
        ) : (
          <Text>Fetching location...</Text>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20},
  title: {fontSize: 20, fontWeight: 'bold', marginBottom: 20},
  values: {marginTop: 20},
  locationContainer: {marginTop: 20, alignItems: 'center'},
});

export default DataDisplay;
