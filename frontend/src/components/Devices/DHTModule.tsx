'use client';

import { Droplet, Microchip, Thermometer } from 'lucide-react';
import DeviceStatus from '../ui/device-status';
import { useQuery } from '@tanstack/react-query';
import { getDHTSensorData } from '@/lib/services/sensors';
import SensorValue from './SensorValue';
import { DeviceModuleProps } from '@/lib/types/global';

const DHTModule = ({ ip, name = 'DHT Sensor' }: DeviceModuleProps) => {
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

  return (
    <div
      className={`text-foreground ${signalStrength < -90 && 'text-muted-foreground'} bg-card relative flex w-[200px] flex-wrap items-end justify-between gap-x-0 gap-y-4 rounded-md p-4 shadow-md`}
    >
      <DeviceStatus
        isFetching={isFetching}
        error={error}
        rssi={signalStrength}
      />
      <div className='flex w-full flex-wrap gap-x-2'>
        <Microchip />
        <h3>{name}</h3>
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
  );
};

export default DHTModule;
