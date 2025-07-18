'use client';

import { useQuery } from '@tanstack/react-query';
import AddDevice from './AddDevice';
import DHTModule from './DHTModule';
import { getDevices } from '@/lib/services/devices';
import { Loader } from 'lucide-react';
import RelayModule from './RelayModule';

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
      <AddDevice className='w-full' />
      <div className='w-full'>
        {isFetching || isLoading ? (
          <Loader className='m-auto h-10 animate-spin' />
        ) : (
          error && (
            <h3 className='text-destructive m-auto'>{`Failed to load devices: ${error?.message}`}</h3>
          )
        )}
      </div>
      {devices.map(device => (
        <DHTModule key={device.ip} ip={device.ip} /> //todo: display different type of sensor for each device based on future type enum
      ))}
      <RelayModule ip='192.168.0.102' />
    </section>
  );
};

export default DevicesPanel;
