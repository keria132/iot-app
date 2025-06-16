import { Droplet, Microchip, Thermometer } from 'lucide-react';
import DeviceStatus from '../ui/device-status';

const TemperatureModule = async () => {
  const data = await fetch('http://192.168.0.100/api/dht');
  const result = await data.json();
  console.log(result);

  return (
    <div className='text-foreground bg-card relative flex w-[200px] flex-wrap items-end justify-between gap-x-0 gap-y-4 rounded-md p-4 shadow-md'>
      <DeviceStatus status={true} />
      <div className='flex w-full flex-wrap gap-x-2'>
        <Microchip />
        <h3 className=''>DHT Sensor</h3>
      </div>
      <div className='flex w-1/2 flex-col items-center'>
        <Thermometer className='h-7 w-7 text-amber-400' />
        <p className='text-2xl'>21°C</p>
      </div>
      <div className='flex w-1/2 flex-col items-center'>
        <Droplet className='h-7 w-7 text-sky-500' />
        <p className='text-2xl'>73%</p>
      </div>
    </div>
  );
};

export default TemperatureModule;
