import { DeviceType } from '@/lib/types/global';

export const CONDITIONER_MIN_TEMP = 10;
export const CONDITIONER_MAX_TEMP = 30;

export const deviceInputFields = [
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

export const deviceTypeSelectOptions = {
  label: 'Device types',
  options: [
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
