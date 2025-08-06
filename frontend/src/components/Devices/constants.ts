import { DeviceType } from '@/lib/types/global';
import { v4 as uuid } from 'uuid';

export const CONDITIONER_MIN_TEMP = 10;
export const CONDITIONER_MAX_TEMP = 30;

export const newDeviceInputFields = [
  {
    label: 'Device Name',
    id: 'deviceName',
    name: 'name',
    defaultValue: 'New Sensor',
  },
  {
    label: 'Local IP',
    id: 'deviceIp',
    name: 'ip',
    defaultValue: '192.168.0.101',
  },
];

export const newDeviceTypeSelectItems = {
  label: 'Device types',
  items: [
    {
      itemName: 'DHT Sensor',
      itemValue: String(DeviceType.DHTSensor),
    },
    {
      itemName: 'Relay',
      itemValue: String(DeviceType.Relay),
    },
  ],
};

export const mockNewDeviceTypeSelectItems = {
  label: 'Available rooms',
  items: [
    {
      itemName: 'Some-room',
      itemValue: uuid(),
    },
  ],
};
