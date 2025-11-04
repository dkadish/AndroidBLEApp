import { Emitter } from 'mitt';
import mitt from "mitt";
// Flexible metadata for events
export type EventMetadata = Record<string, string | number | boolean | Date>;

// Export the event emitter so other components can use it
export {eventEmitter};

//This is your BLE manager + context provider

type BLEContextType = {
  manager: BleManager;
  devices: Device[];
  connectedDevice: Device | null;
  characteristicValues: {[key: string]: number}; // Changed from string to number
  scanForDevices: () => void;
  connectToDevice: (device: Device) => Promise<void>;
  enableNotifications: (
    device: Device,
    characteristics: {
      serviceUUID: string;
      characteristicUUID: string;
      label: string;
    }[],
  ) => Promise<void>;
  eventEmitter: AppEventEmitter; // Expose event emitter
};
// BLE Data Updated Event
export interface BLEDataUpdated {
  type: 'ble_data_updated';
  timestamp: Date;
  deviceId: string;
  serviceUUID: string;
  characteristicUUID: string;
  rawValue: string;
  decodedValue: number;
  source: string;
}

// Sensor Event for processed sensor readings
export interface SensorEvent {
  type: 'sensor_reading';
  timestamp: Date;
  source: string;
  olfactoryData?: {
    readings: Record<string, number>;
    units: Record<string, string>;
  description: string;
  };

// Event map for mitt - maps event types to their payload types
export type Events = {
  ble_data_updated: BLEDataUpdated;
  sensor_reading: SensorEvent;
  //here you add a an event for data archieving, visually speaking
  //technically i could use the same event for sensor-reading
};

// Type alias for our event emitter
export type AppEventEmitter = Emitter<Events>;
export const emitter = mitt<Events>();
//here you need to create an event omitter for the sensor data in datadisplay
//in data dsiplay you will listen to button presses for "arhcive" 
//this means that whatever is archieverd is listed to
//then tjis listened to even will be implemented with async storage
