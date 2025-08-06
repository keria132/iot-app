import { queryOptions } from '@tanstack/react-query';
import { getDevices } from './services/devices';
import { getRooms } from './services/rooms';

export const MAIN_HUB_IP = 'http://192.168.0.100';

export const RESPONSE_STATUS: { [key: number]: string } = {
  409: 'The resource already exists!',
  400: 'Missing required fields',
};

export const defaultHeaders = {
  'Content-Type': 'application/json',
};

// const maxStaleTime = 240000; // 4 minutes

const defaultQueryOptions = {
  staleTime: 5000,
  refetchInterval: 7000,
};

// const maxStaleQueryOptions = {
//   staleTime: maxStaleTime,
// };

export const devicesQueryOptions = () => {
  return queryOptions({
    queryKey: ['devices'],
    queryFn: async () => getDevices(),
    ...defaultQueryOptions,
  });
};

export const roomsQueryOptions = () => {
  return queryOptions({
    queryKey: ['rooms'],
    queryFn: async () => getRooms(),
    ...defaultQueryOptions,
  });
};
