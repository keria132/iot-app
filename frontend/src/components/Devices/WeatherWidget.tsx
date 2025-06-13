import { CloudSun } from 'lucide-react';
import DeviceStatus from '../ui/device-status';

const WeatherWidget = () => (
  <div className='text-foreground bg-card text-muted-foreground relative flex min-w-[270px] flex-wrap justify-between gap-4 rounded-md p-4 shadow-md'>
    <DeviceStatus status={false} />
    <div className='flex flex-col gap-2'>
      <h3>Weather</h3>
      <CloudSun className='h-18 w-[100px]' />
    </div>
    <div className='flex flex-col gap-1'>
      <p className='text-2xl'>19°C</p>
      <p>Humidity: 63%</p>
    </div>
  </div>
);

export default WeatherWidget;
