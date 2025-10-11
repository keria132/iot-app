import { deviceTypeSelectOptions } from '@/components/Devices/constants';

export interface DeviceModuleProps {
  ip: string;
  name: string;
  roomId: string;
  roomName: string;
}

export interface Device {
  ip: string;
  name: string;
  online: boolean;
  type: DeviceType;
  roomId: string;
}

export enum DeviceType {
  DHTSensor = 'DHTSensor',
  Relay = 'Relay',
}

export interface Room {
  name: string;
  uuid: string;
}

export interface SetRelayStatusPayload {
  ip: string;
  status: boolean;
}

//TODO: consider typed query keys
// export enum QueryKeys {
//   Devices = 'devices',
//   Rooms = 'rooms',
//   Relay = 'Relay',
//   DHTSensor = 'DHTSensor',
// }

export type addDeviceSelectOptionsType = typeof deviceTypeSelectOptions;
