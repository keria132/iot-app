export interface DeviceModuleProps {
  ip: string;
  name?: string;
}

export interface Device {
  ip: string;
  name: string;
  online: boolean;
  type: DeviceType;
}

export enum DeviceType {
  DHTSensor = 'DHTSensor',
  Relay = 'Relay',
}

export interface SetRelayStatusPayload {
  ip: string;
  status: boolean;
}
