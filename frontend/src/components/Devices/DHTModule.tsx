'use client';

import { Droplet, Microchip, Thermometer } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getDHTSensorData } from '@/lib/services/sensors';
import SensorValue from './SensorValue';
import { DeviceModuleProps } from '@/lib/types/global';
import DeviceStatus from './DeviceStatus';
import DeviceMenu from './DeviceMenu';
import { Badge } from '../ui/badge';

const DHTModule = ({ ip, name }: DeviceModuleProps) => {
  const {
    data: { temperature, humidity, signalStrength },
    isFetching,
    error,
  } = useQuery({
    queryKey: ['DHTSensor'],
    queryFn: async () => getDHTSensorData('http://' + ip),
    refetchInterval: 7000,
    staleTime: 20000,
    initialData: { temperature: 0, humidity: 0, signalStrength: -100 },
  });

  //TODO: Too much overlapping component styles between devices, nake it into separate wrappers
  return (
    <div
      className={`text-foreground ${signalStrength < -90 && 'text-muted-foreground'} bg-card relative flex w-[160px] flex-wrap items-start justify-start rounded-md p-2 shadow-md`}
    >
      <div className='top-2 left-3 flex w-full justify-between'>
        <div className='flex gap-x-1'>
          <DeviceMenu name={name} ip={ip} />
          <Badge
            className={`${signalStrength < -90 && 'bg-muted-foreground'} text-xs`}
          >
            Unsorted
          </Badge>
        </div>
        <DeviceStatus
          isFetching={isFetching}
          error={error}
          rssi={signalStrength}
        />
      </div>
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
    </div>
  );
};

export default DHTModule;
