import { Device, DeviceType } from '@/lib/types/global';
import RelayModule from './RelayModule';
import DHTModule from './DHTModule';
import { useQuery } from '@tanstack/react-query';
import { roomsQueryOptions } from '@/lib/constants';
import { useMemo } from 'react';

const devicesComponents = {
  [DeviceType.DHTSensor]: DHTModule,
  [DeviceType.Relay]: RelayModule,
};

//TODO: consider avoiding prop drilling there
const DeviceRenderer = ({ name, ip, type, roomId }: Device) => {
  const Device = devicesComponents[type];
  const {
    data: rooms = [],
    isFetching,
    isLoading,
  } = useQuery(roomsQueryOptions());

  const roomName = useMemo(() => {
    return isFetching || isLoading
      ? 'Loading...'
      : rooms.find(room => room.uuid === roomId)?.name || 'Unsorted';
  }, [rooms, roomId, isFetching, isLoading]);

  return Device ? (
    <Device ip={ip} name={name} roomId={roomId} roomName={roomName} />
  ) : (
    <div className='bg-card rounded-md p-4'>
      <h3>Unknown device</h3>
      <p>Name: {name}</p>
      <p>IP: {ip}</p>
      <p>Type: {type}</p>
    </div>
  );
};

export default DeviceRenderer;
