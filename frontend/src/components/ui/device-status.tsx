import { Wifi, WifiHigh, WifiLow, WifiOff, WifiZero } from 'lucide-react';

interface DeviceStatusProps {
  isFetching: boolean;
  error: Error | null;
  rssi: number;
}

const getWifiStatusIcon = (rssi: number) => {
  switch (true) {
    case rssi >= -50:
      return Wifi;
    case rssi >= -65:
      return WifiHigh;
    case rssi >= -75:
      return WifiLow;
    case rssi >= -90:
      return WifiZero;
    case rssi < -90:
      return WifiOff;
    default:
      return WifiOff;
  }
};

const DeviceStatus = ({ isFetching, error, rssi }: DeviceStatusProps) => {
  const WifiIcon = getWifiStatusIcon(rssi);
  const statusColor = error || rssi < -90 ? 'bg-destructive' : 'bg-green-600';

  return (
    <div className='absolute top-2 right-3 flex gap-x-1'>
      <div className='relative'>
        <WifiIcon className='h-5 w-5' />
        <span
          className={`${isFetching && 'bg-foreground/30'} absolute top-1/2 left-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 animate-ping rounded-full`}
        />
      </div>
      <div className={`${statusColor} h-2 w-2 rounded-full`} />
    </div>
  );
};

export default DeviceStatus;
