//overll i need to clean up the code
// i can call componetns, exporet them within another component and not have this huge appliction
//the buttons as well, im unsure how efficiently i amd oing the current exporting
import React, {useState, useEffect} from 'react';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StyleSheet, View, SafeAreaView, Text, Button, ScrollView, TextInput, Pressable, Alert, PermissionsAndroid, Platform } from "react-native";
import {useBLE} from '../BLEUniversal';
import { VictoryBar, VictoryChart, VictoryTheme, VictoryArea, VictoryPolarAxis, VictoryZoomContainer } from "victory-native";
import Slider from '@react-native-community/slider';
import mitt from 'mitt';

import Share from 'react-native-share';

import {AppEventEmitter, BLEDataUpdated} from '../types';
import { Emitter } from 'mitt';
import { SensorEvent } from "../types"; 
import { DocumentDirectoryPath, writeFile, DownloadDirectoryPath } from 'react-native-fs';


// Create a global event emitter instance
const eventEmitter: AppEventEmitter = mitt();

const DataDisplay = () => {
  //we are taking chaarcteristic values form useBle, which we have called it above
  const {characteristicValues} = useBLE();

  //here we are creating a variable for each sensor
  //we are retreiving it from the characteristic values object
  //we pass the charactersiticValues from useBle, more specifically the context provider
  // the 'sensor' indicates which sensor we need to attribute the object to
  //|| operator is an or operator, which tells us that if theres no sensor value then throw a zero
  // Values are already numbers, no need for parseFloat
  const methane = characteristicValues['Methane'] || 0;
  const ammonia = characteristicValues['Ammonia'] || 0;
  const formaldehyde = characteristicValues['Formaldehyde'] || 0;
  const voc = characteristicValues['Voletile Organic Compounds'] || 0;
  const odour = characteristicValues['Odor'] || 0;
  const hydrogenSulfide = characteristicValues['Hydrogen Sulfide'] || 0;
  const ethanol = characteristicValues['Ethanol'] || 0;
  const nitrogenDioxide = characteristicValues['Nitrogen Dioxide'] || 0;

  //here we are creatign an object for the zoomlevel, which will be pasted into the axis of the radar chart
  // i think that zoomLevel is the object, and then set is a command which make is changable
  //use state is somethign about changing and then "saving" in typescript/react native
  //it is about creating state variables, which allows for the variables to hold memeory, and persit across renders
  //the zoomLevel is the state variable, ehich retains data between renders
  // and the setZoomLevel is the setter function reRender the component with the respective data,
  //setter function is to ask react to update to reRender the component
  //We call the setterFunction when we need a "refresh" a moment to update and rerender the component, whether its with a boolean, etc.
  //the number 4 is the same as if we would put it to const zoomlevel = 4, but we are passing it onto the conditional 
  //and then we attribute 4 to a condition, in our case it is the sliders value for zooming in
  //and then onvaluechange is set to the setZoomLevel, which i am assuming allows for the component to retain, adn to memorize
const [zoomLevel, setZoomLevel] = useState(4);
//maybe here i can pass on some characteristic values, like methane cause its the most active one? it changes in proportion to it?

//these are all state variables
//historicalfingerprints is equal to the event emiiter data within sensorevent, which is in the types.ts file
//the reast are equal to booleans and strings
  const [historicalfingerprints, setHistoricalfingerprints] = useState<SensorEvent[]>([]);
  //description data could be handled separately
  const [showfingerprints, setShowfingerprints] = useState(false);
const [showTextInput, setShowTextInput] = useState(false);
const [description, setDescription] = useState("");


//i think i am passing the data in a problematic way, becasue for y: i am passing a string  of the name of the sensor
//and then the x is the value of the sensor
//this is what i mean -> data={radarData.map(d => ({ x: d.label, y: d.value }))}
//i am mapping the values
  // Transform BLE data for radar chart
  //here we are creating an object for radarData for all of the sensor data
  //a constant variable storing an array of objects
  const radarData = [
    //an array of objects, seprated by {}
    {label: '3. Ch4', value: methane}, // Use raw small values
    {label: '2. NH3', value: ammonia},
    {label: '1. HCHO', value: formaldehyde},
    {label: '8. VOC', value: voc},
    {label: '7. Odour', value: odour},
    {label: '6. H2S', value: hydrogenSulfide},
    {label: '5. Etoh', value: ethanol},
    {label: '4. No2', value: nitrogenDioxide},
  ].filter(item => !isNaN(item.value));


  // Useffect is used to showcase tmeporayr, or changing data
  //think of it as an addiotnal layer that is changed/laoded when something has changed
useEffect(() => {
  const loadFingerprints = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const fingerprintKeys = keys.filter(k => k.startsWith("sensor_fingerprint_"));
      const savedData = await AsyncStorage.multiGet(fingerprintKeys);
      console.log(savedData);

      // Filter out null values before parsing
      const parsedData = savedData
        .map(([_, value]) => (value ? JSON.parse(value) : null))
        .filter(item => item !== null);

      setHistoricalfingerprints(parsedData as SensorEvent[]);
    } catch (err) {
      console.error("Error loading fingerprints:", err);
    }
  };

  loadFingerprints();
}, []);

//what are the asqaure brakets for

  // Save fingerprint handler
  //technically you can make this component, then asdd the button here, and call it upin the button, but 
  //but you already do this, 
  //you can insetad handler it all in a separate "Exported" component
  const saveFingerprint = async () => {
    //im unsure on why this fingerprint is maintained within the async, and not created outside
    //this is the question
    //could it be becasue we are retreiving the emitter from types, the event from there?
    
    const fingerprint: SensorEvent = {
      //here we are assining the sensors to the respectibe sensorevent emitter values
      type: 'sensor_reading',
      timestamp: new Date(),
      source: 'BLE Device',
      olfactoryData: {
        //object
        readings: {
          //couldn't i here just indicate the radar data object?
          CH4: methane,
          NH3: ammonia,
          HCHO: formaldehyde,
          VOC: voc,
          Odour: odour,
          H2S: hydrogenSulfide,
          Etoh: ethanol,
          NO2: nitrogenDioxide,
        },
        units: {
          //do i have to create this?
          CH4: 'ppm',
          NH3: 'ppm',
          HCHO: 'ppm',
          VOC: 'ppm',
          Odour: 'a.u.',
          H2S: 'ppm',
          Etoh: 'ppm',
          NO2: 'ppm',
        },
        description,
      }
    };
const stringData = JSON.stringify(fingerprint);
    // Emit event for any listeners
    eventEmitter.emit('sensor_reading', fingerprint);
    // Save to AsyncStorage
    const key = `sensor_fingerprint_${fingerprint.timestamp.getTime()}`;
  try {
  await AsyncStorage.setItem(key, stringData);
} catch (err) {
  console.error("Failed to save fingerprint:", err);
}
//i may need to make a function, just so i can call it within the button?

setShowTextInput(false);
setDescription("");
  //i need to call this getLocalData now using a button where i onlick do the "getLocaldata"
    // Update local state
    setHistoricalfingerprints(prev => [fingerprint, ...prev]);
  };

//the download directory path works for android,
//the document directoery path does not work for androiud due to some permission

//detect device neccesaey for on share
//on detect ios do documentdirectorypath
//on android do download directory path
//i need to request permission for android path

//i am creating this to be callled within fingerprintys, so it saqves a json file in the back end
  const saveFile = async () => {
      const path = `${DownloadDirectoryPath}/${Date.now()}.json`;
      await writeFile(path, JSON.stringify(historicalfingerprints));
    return path;
  }


  //the on share component is created separately,  becasue i want the user to be abel to saver the gile autonosmly
  //this is becasue if we creqate this within the savefingerprint component, then it will be sharefd every time a file is
  const onShare = async () => {
    try {
       const path = await saveFile();
       console.log('saved')
    const shareOptions = {
      title: 'Share file',
      failOnCancel: false,
      saveToFiles: true,
      urls: [path],
      //here you need to mention saving file
    };
      const ShareResponse = await Share.open(shareOptions);
      console.log('Result =>', ShareResponse);
    } catch (error) {
      console.log('Error =>', error);
    }
  };
  
  return (
    <ScrollView>
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Data Dashboard</Text>
<VictoryChart
  polar
  theme={VictoryTheme.clean}
  domain={{ y: [0, zoomLevel] }}
>
  <VictoryPolarAxis dependentAxis labelPlacement="vertical" tickFormat={() => ""} />
  <VictoryPolarAxis labelPlacement="parallel" />
  <VictoryArea
    interpolation="linear"
    data={radarData.map(d => ({ x: d.label, y: d.value }))}
  />
</VictoryChart>

<Slider
minimumValue={0.1} 
maximumValue={4.1} 
step={0.1} 
value={zoomLevel} 
onValueChange={setZoomLevel}
/>

{!showTextInput ? (
<Button title="Fingerprint" onPress={() => setShowTextInput(true)} />
) : (
  <View>
    <TextInput
         placeholder="I smelled..."
      value={description}
      onChangeText={setDescription}
    />
    <Button
      title="Save"
      onPress={() => {
        saveFingerprint(); 
        setShowTextInput(false); // hide input after saving
                saveFile(); 
      }}
    />
  </View>
)}
 
{/* this button is for sharing the data file, which we have ti later put in view */}
        <Button onPress={onShare} title="Share" />
            {/* Show raw values for reference */}
      <View style={styles.values}>
                <Text>1. HCHO: {formaldehyde.toFixed(4)}</Text>
        <Text>2. NH3: {ammonia.toFixed(4)}</Text>
                <Text>3. Ch4: {methane.toFixed(4)}</Text>
                        <Text>4. No2: {nitrogenDioxide.toFixed(4)}</Text>
        <Text>5. Etoh: {ethanol.toFixed(4)}</Text>
                <Text>6. HS2: {hydrogenSulfide.toFixed(4)}</Text>
                <Text>7. Odour: {odour.toFixed(4)}</Text>
                <Text>8. VOC: {voc.toFixed(4)}</Text>
      </View>

        <Button title={showfingerprints ? "Hide Fingerprints" : "Show Fingerprints"} onPress={() => setShowfingerprints(prev => !prev)} />


      {/* Historical fingerprints */}
  
      {/* Here we are rendering the fingerpringt data using vitory native visualisation chart */}
{showfingerprints && (
  <View style={{ width: '100%', marginTop: 20 }}>
    {historicalfingerprints.map((fingerprint, idx) => {
      const readings = fingerprint.olfactoryData?.readings;

      return (
        <View key={idx} style={[styles.container, { marginBottom: 30 }]}>
          <Text>{new Date(fingerprint.timestamp).toLocaleString()}</Text>
          <VictoryChart polar theme={VictoryTheme.clean} domain={{ y: [0, 4.1] }}>
            <VictoryPolarAxis dependentAxis labelPlacement="vertical" tickFormat={() => ''} />
            <VictoryPolarAxis labelPlacement="parallel" />
            <VictoryArea
              interpolation="catmullRom"
              data={Object.entries(readings || {}).map(([label, value]) => ({
                x: label,
                y: value,
              }))}
            />
          </VictoryChart>

              {/* Render the readings as text */}
          <Text>1. HCHO: {readings?.HCHO.toFixed(2)}</Text>
          <Text>2. NH3: {readings?.NH3.toFixed(2)}</Text>
          <Text>3. CH4: {readings?.CH4.toFixed(2)}</Text>
          <Text>4. NO2: {readings?.NO2.toFixed(2)}</Text>
          <Text>5. Etoh: {readings?.Etoh.toFixed(2)}</Text>
          <Text>6. H2S: {readings?.H2S.toFixed(2)}</Text>
          <Text>7. Odour: {readings?.Odour.toFixed(2)}</Text>
          <Text>8. VOC: {readings?.VOC.toFixed(2)}</Text>
       
  <Text>Description: {fingerprint.olfactoryData?.description}</Text>

</View>
      );
    })}
  </View>
)}
    </SafeAreaView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  values: {
    marginTop: 20,
  },
});

export default DataDisplay;
