'use client';

import { Droplet, Microchip, Thermometer } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getDHTSensorData } from '@/lib/services/sensors';
import SensorValue from './SensorValue';
import { DeviceModuleProps } from '@/lib/types/global';
import DeviceCard from '../ui/custom/device-card';

const DHTModule = ({ ip, name, roomName, roomId }: DeviceModuleProps) => {
  const {
    data: { temperature, humidity, signalStrength },
    isFetching,
    error,
  } = useQuery({
    queryKey: ['DHTSensor', ip],
    queryFn: async () => getDHTSensorData('http://' + ip),
    refetchInterval: 7000,
    staleTime: 20000,
    initialData: { temperature: 0, humidity: 0, signalStrength: -100 },
  });

  return (
    <DeviceCard
      name={name}
      ip={ip}
      roomId={roomId}
      roomName={roomName}
      isFetching={isFetching}
      error={error}
      signalStrength={signalStrength}
    >
      <div className='flex flex-wrap gap-y-3 p-2 pt-3 pb-0'>
        <div className='flex w-full flex-wrap items-center gap-x-1'>
          <Microchip />
          <h3 className='text-lg'>{name}</h3>
        </div>
        <SensorValue
          icon={<Thermometer className='h-7 w-7 text-amber-400' />}
          isFetching={isFetching}
          error={error}
          value={Math.round(temperature) + '°C'}
        />
        <SensorValue
          icon={<Droplet className='h-7 w-7 text-sky-500' />}
          isFetching={isFetching}
          error={error}
          value={Math.round(humidity) + '%'}
        />
      </div>
    </DeviceCard>
  );
};

export default DHTModule;
