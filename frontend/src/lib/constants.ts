import { queryOptions } from '@tanstack/react-query';
import { getDevices } from './services/devices';
import { getRooms } from './services/rooms';
import { DeviceType } from './types/global';

export const MAIN_HUB_IP = 'ESP_SERVER_IP';

const MOCK_DEVICES = [
  { ip: '192.168.0.101', name: 'Relay kitchen', online: true, type: DeviceType.Relay, roomId: '1234' },
  { ip: '192.168.0.102', name: 'DHT sensor', online: true, type: DeviceType.DHTSensor, roomId: '12345' },
];
const MOCK_ROOMS = [
  { name: 'Kitchen', uuid: '1234' },
  { name: 'Hall', uuid: '12345' },
];

export const RESPONSE_STATUS: { [key: number]: string } = {
  409: 'The resource already exists!',
  400: 'Missing required fields',
};

export const defaultHeaders = {
  'Content-Type': 'application/json',
};

const devQueryOptions = {
  retry: 0,
};

export const devicesQueryOptions = () =>
  queryOptions({
    queryKey: ['devices'],
    queryFn: async () => getDevices(),
    initialData: MOCK_DEVICES,
    ...devQueryOptions,
  });

export const roomsQueryOptions = () =>
  queryOptions({
    queryKey: ['rooms'],
    queryFn: async () => getRooms(),
    initialData: MOCK_ROOMS,
    ...devQueryOptions,
  });
