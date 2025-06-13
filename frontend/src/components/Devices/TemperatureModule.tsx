import { Droplet, Microchip, Thermometer } from 'lucide-react';
import DeviceStatus from '../ui/device-status';

const TemperatureModule = () => (
  <div className='text-foreground bg-card relative flex w-[200px] flex-wrap items-end justify-between gap-x-0 gap-y-4 rounded-md p-4 shadow-md'>
    <DeviceStatus status={true} />
    <div className='flex w-full flex-wrap gap-x-2 gap-y-1'>
      <Microchip />
      <h3 className=''>DHT Sensor</h3>
      {/* <p className='w-full text-xs'>Room {deviceRoom}</p> */}
    </div>
    <div className='w-1/2'>
      <Thermometer />
      <p className='text-2xl'>21°C</p>
    </div>
    <div className='w-1/2'>
      <Droplet />
      <p className='text-2xl'>73%</p>
    </div>
  </div>
);

export default TemperatureModule;
