'use client';

import { useQuery } from '@tanstack/react-query';
import AddDevice from './AddDevice';
import { getDevices } from '@/lib/services/devices';
import { Loader } from 'lucide-react';
import DeviceRenderer from './DeviceRenderer';
import { useMemo } from 'react';
import { Device, DeviceType } from '@/lib/types/global';

const deviceTypeName: Record<string, string> = {
  [DeviceType.DHTSensor]: 'Sensors',
  [DeviceType.Relay]: 'Relays',
};

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

  const devicesByType = useMemo(() => {
    const deviceTypes: Record<DeviceType, Device[]> = {
      [DeviceType.Relay]: [],
      [DeviceType.DHTSensor]: [],
    };

    devices.forEach(device => deviceTypes[device.type].push(device));

    return deviceTypes;
  }, [devices]);

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
      <div className='flex w-full flex-wrap gap-4'>
        {Object.entries(devicesByType).map(([deviceType, devices], index) => (
          <div className='flex w-full flex-wrap gap-2' key={index}>
            {devices.length !== 0 && (
              <h2 className='w-full text-lg'>{deviceTypeName[deviceType]}:</h2>
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
          </div>
        ))}
      </div>
    </section>
  );
};

export default DevicesPanel;
