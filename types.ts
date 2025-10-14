import { Emitter } from 'mitt';

// Flexible metadata for events
export type EventMetadata = Record<string, string | number | boolean | Date>;

// Olfactory data with flexible structure
export type OlfactoryData = {
  readings: Record<string, number>; // e.g., { 'CH4': 150, 'CO2': 400 }
  units?: Record<string, string>;   // e.g., { 'CH4': 'ppm', 'CO2': 'ppm' }
  calibration?: Record<string, any>;
  [key: string]: any; // Allow additional properties
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
  };
}

// Event map for mitt - maps event types to their payload types
export type Events = {
  ble_data_updated: BLEDataUpdated;
  sensor_reading: SensorEvent;
};

// Type alias for our event emitter
export type AppEventEmitter = Emitter<Events>;
