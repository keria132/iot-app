'use client';

import { useState } from 'react';
import { Slider } from '../ui/slider';
import { Switch } from '../ui/switch';
import { CONDITIONER_MAX_TEMP, CONDITIONER_MIN_TEMP } from './constants';
import DeviceStatus from '../ui/device-status';

const AirConditioner = () => {
  const [temperature, setTemperature] = useState(23); //temporary hardcode

  return (
    <div className='text-muted-foreground bg-card relative flex w-[250px] flex-wrap items-center justify-start gap-4 rounded-md p-4 shadow-md'>
      <DeviceStatus isFetching={false} error={null} rssi={-100} />
      <h3>Air Conditioner</h3>
      <Switch id='conditioner' disabled={true} />
      <div className='flex w-full flex-col gap-1 text-center'>
        <p className='text-4xl'>{temperature}°C</p>
        <p className='text-muted-foreground text-xs'>Temperature</p>
      </div>
      <div className='w-full'>
        <Slider
          onValueChange={value => setTemperature(value[0])}
          defaultValue={[temperature]}
          min={CONDITIONER_MIN_TEMP}
          max={CONDITIONER_MAX_TEMP}
          step={1}
          className='py-2'
          disabled
        />
        <div className='text-muted-foreground flex w-full justify-between text-xs'>
          <p>{CONDITIONER_MIN_TEMP}°C</p>
          <p>{CONDITIONER_MAX_TEMP}°C</p>
        </div>
      </div>
    </div>
  );
};

export default AirConditioner;
