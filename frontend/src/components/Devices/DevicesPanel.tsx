'use client';

import { useQuery } from '@tanstack/react-query';
import AddDevice from './AddDevice';
import { getDevices } from '@/lib/services/devices';
import { Loader } from 'lucide-react';
import DeviceRenderer from './DeviceRenderer';

const DevicesPanel = () => {
  const {
    data: devices,
    isFetching,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['devices'],
    queryFn: async () => getDevices(),
    initialData: [],
  });

  return (
    <section className='flex flex-wrap gap-4'>
      <AddDevice className='mb-1' />
      {isFetching || isLoading ? (
        <Loader className='h-10 animate-spin' />
      ) : (
        error && (
          <h3 className='text-destructive flex items-center'>{`Failed to load devices: ${error?.message}`}</h3>
        )
      )}
      {devices.map(({ name, ip, type, online }) => (
        <DeviceRenderer
          key={ip}
          name={name}
          ip={ip}
          type={type}
          online={online}
        />
      ))}
    </section>
  );
};

export default DevicesPanel;
