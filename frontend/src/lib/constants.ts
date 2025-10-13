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

const MAX_STALE_TIME = 240000; // 4 minutes

const maxStaleQueryOptions = {
  staleTime: MAX_STALE_TIME,
};

// const defaultQueryOptions = {
//   staleTime: 5000,
//   refetchInterval: 7000,
// };

export const devicesQueryOptions = () =>
  queryOptions({
    queryKey: ['devices'],
    queryFn: async () => getDevices(),
    ...maxStaleQueryOptions,
  });

export const roomsQueryOptions = () =>
  queryOptions({
    queryKey: ['rooms'],
    queryFn: async () => getRooms(),
    ...maxStaleQueryOptions,
  });
