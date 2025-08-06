'use client';

import { useQuery } from '@tanstack/react-query';
import AddRoom from './AddRoom';
import { Device } from '@/lib/types/global';
import { useMemo } from 'react';
import { devicesQueryOptions, roomsQueryOptions } from '@/lib/constants';
import CustomHeading from '../ui/custom/custom-heading';
import { v4 as uuid } from 'uuid';
import DeviceRenderer from '../Devices/DeviceRenderer';
import CustomLoader from '../ui/custom/custom-loader';

const RoomsPanel = () => {
  const {
    data: devices = [],
    isFetching,
    isLoading,
    error,
  } = useQuery(devicesQueryOptions());
  const { data: rooms = [] } = useQuery(roomsQueryOptions());

  const devicesByRoom = useMemo(() => {
    const roomMap = new Map(rooms.map(({ uuid, name }) => [uuid, name]));
    const deviceRooms: Record<string, Device[]> = {};

    devices.forEach(device => {
      const deviceRoom =
        device.roomId && roomMap.has(device.roomId)
          ? roomMap.get(device.roomId)!
          : 'Unsorted';

      if (!deviceRooms[deviceRoom]) {
        deviceRooms[deviceRoom] = [];
      }

      deviceRooms[deviceRoom].push(device);
    });

    return deviceRooms;
  }, [devices, rooms]);

  return (
    <section className='flex flex-wrap gap-4'>
      <AddRoom className='mb-1' />
      <CustomLoader
        isFetching={isFetching}
        isLoading={isLoading}
        error={error}
      />
      <div className='flex w-full flex-wrap gap-4'>
        {Object.entries(devicesByRoom).map(([roomName, roomDevices]) => (
          <div className='flex w-full flex-wrap gap-2' key={uuid()}>
            <CustomHeading>{roomName}</CustomHeading>
            {roomDevices.map(({ ip, name, type, online, roomId }) => (
              <DeviceRenderer
                key={ip}
                name={name}
                ip={ip}
                type={type}
                online={online}
                roomId={roomId}
              />
            ))}
          </div>
        ))}
      </div>
    </section>
  );
};

export default RoomsPanel;
