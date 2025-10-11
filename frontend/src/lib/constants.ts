import { queryOptions } from '@tanstack/react-query';
import { getDevices } from './services/devices';
import { getRooms } from './services/rooms';

export const MAIN_HUB_IP = 'http://192.168.9.231';

export const RESPONSE_STATUS: { [key: number]: string } = {
  409: 'The resource already exists!',
  400: 'Missing required fields',
};

export const defaultHeaders = {
  'Content-Type': 'application/json',
};

const maxStaleTime = 240000; // 4 minutes

const maxStaleQueryOptions = {
  staleTime: maxStaleTime,
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
