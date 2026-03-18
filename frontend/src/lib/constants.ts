import { queryOptions } from '@tanstack/react-query';
import { getDevices } from './services/devices';
import { getRooms } from './services/rooms';

export const MAIN_HUB_IP = 'ESP_SERVER_IP';

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
    ...devQueryOptions,
  });

export const roomsQueryOptions = () =>
  queryOptions({
    queryKey: ['rooms'],
    queryFn: async () => getRooms(),
    ...devQueryOptions,
  });
