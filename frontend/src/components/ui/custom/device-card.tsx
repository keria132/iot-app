import DeviceMenu from '@/components/Devices/DeviceMenu';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';
import { Badge } from '../badge';
import DeviceStatus from '@/components/Devices/DeviceStatus';

interface DeviceCardProps {
  children: ReactNode;
  name: string;
  ip: string;
  roomId: string;
  roomName: string;
  isFetching: boolean;
  error: Error | null;
  signalStrength: number;
}

const DeviceCard = ({
  children,
  name,
  ip,
  roomId,
  roomName,
  isFetching,
  error,
  signalStrength,
}: DeviceCardProps) => (
  <div
    className={cn(
      `text-foreground ${signalStrength < -90 && 'text-muted-foreground'}`,
      'bg-card relative flex w-[160px] flex-wrap items-start justify-start rounded-md p-2 shadow-md'
    )}
  >
    <div className='top-2 left-3 flex w-full justify-between'>
      <div className='flex gap-x-1'>
        <DeviceMenu name={name} ip={ip} roomId={roomId} />
        <Badge
          className={`${signalStrength < -90 && 'bg-muted-foreground'} text-xs`}
        >
          {roomName}
        </Badge>
      </div>
      <DeviceStatus
        isFetching={isFetching}
        error={error}
        rssi={signalStrength}
      />
    </div>
    {children}
  </div>
);

export default DeviceCard;
