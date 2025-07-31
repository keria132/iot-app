import { Split } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getRelayStatus } from '@/lib/services/relays';
import { DeviceModuleProps } from '@/lib/types/global';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';
import useRelaySwitchMutation from '@/lib/hooks/useRelaySwitchMutation';
import DeviceStatus from './DeviceStatus';
import { Badge } from '../ui/badge';
import DeviceMenu from './DeviceMenu';

const RelayModule = ({ ip, name = 'Device' }: DeviceModuleProps) => {
  const {
    data: { relayStatus, signalStrength },
    isFetching,
    error,
  } = useQuery({
    queryKey: ['Relay', ip],
    queryFn: async () => getRelayStatus('http://' + ip),
    refetchInterval: 7000,
    staleTime: 20000,
    initialData: { relayStatus: false, signalStrength: -100 },
  });

  const relaySwitchMutation = useRelaySwitchMutation();

  const handleRelaySwitch = (isChecked: boolean) =>
    relaySwitchMutation.mutate({ ip, status: isChecked });

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
      <div className='flex flex-wrap gap-y-3 p-2 pt-3'>
        <div className='flex w-full flex-wrap items-center gap-x-1'>
          <Split />
          <h3 className='text-lg'>{name}</h3>
        </div>
        <div className='flex items-center gap-2'>
          <Switch
            id='relay'
            checked={relayStatus}
            className='cursor-pointer'
            onCheckedChange={handleRelaySwitch}
          />
          <Label htmlFor='relay'>{relayStatus ? 'On' : 'Off'}</Label>
        </div>
      </div>
    </div>
  );
};

export default RelayModule;
