'use client';

import { useQuery } from '@tanstack/react-query';
import AddDevice from './AddDevice';
import DeviceRenderer from './DeviceRenderer';
import { useMemo } from 'react';
import { Device, DeviceType } from '@/lib/types/global';
import { devicesQueryOptions } from '@/lib/constants';
import CustomHeading from '../ui/custom/custom-heading';
import { v4 as uuid } from 'uuid';
import CustomLoader from '../ui/custom/custom-loader';

const deviceTypeName: Record<string, string> = {
  [DeviceType.DHTSensor]: 'Sensors',
  [DeviceType.Relay]: 'Relays',
};

const DevicesPanel = () => {
  const { data: devices = [], isFetching, isLoading, error } = useQuery(devicesQueryOptions());

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
      <AddDevice />
      <CustomLoader isFetching={isFetching} isLoading={isLoading} error={error} />
      <div className='flex w-full flex-wrap gap-y-4'>
        {Object.entries(devicesByType).map(([deviceType, devicesGroup]) => {
          if (!devicesGroup.length) return null;

          return (
            <div className='flex w-full flex-wrap gap-2' key={uuid()}>
              {devicesGroup.length !== 0 && <CustomHeading>{deviceTypeName[deviceType]}</CustomHeading>}
              {devicesGroup.map(({ name, ip, type, online, roomId }) => (
                <DeviceRenderer key={ip} name={name} ip={ip} type={type} online={online} roomId={roomId} />
              ))}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default DevicesPanel;
