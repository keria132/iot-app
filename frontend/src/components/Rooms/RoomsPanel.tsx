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
  const { data: devices = [], isFetching, isLoading, error } = useQuery(devicesQueryOptions());
  const { data: rooms = [] } = useQuery(roomsQueryOptions());

  const roomsByDevices = useMemo(() => {
    const roomsDevices = rooms.reduce<Record<string, Device[]>>((accumulator, { name }) => {
      accumulator[name] = [];

      return accumulator;
    }, {});

    devices.forEach(device => {
      const assignedRoomName = rooms.find(({ uuid }) => uuid === device.roomId)?.name ?? 'Unsorted';

      if (roomsDevices[assignedRoomName]) {
        roomsDevices[assignedRoomName].push(device);
        return;
      }

      roomsDevices[assignedRoomName] = [device];
    });

    return roomsDevices;
  }, [devices, rooms]);

  return (
    <section className='flex flex-wrap gap-4'>
      <AddRoom />
      <CustomLoader isFetching={isFetching} isLoading={isLoading} error={error} />
      <div className='flex w-full flex-wrap gap-y-4'>
        {Object.entries(roomsByDevices).map(([roomName, roomDevices]) => (
          <div className='flex w-full flex-wrap gap-2' key={uuid()}>
            <CustomHeading>{roomName}</CustomHeading>
            {!roomDevices.length ? (
              <p className='text-muted-foreground'>No assigned devices</p>
            ) : (
              roomDevices.map(({ ip, name, type, online, roomId }) => (
                <DeviceRenderer key={uuid()} name={name} ip={ip} type={type} online={online} roomId={roomId} />
              ))
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default RoomsPanel;
