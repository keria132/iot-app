import { Split } from 'lucide-react';
import DeviceStatus from '../ui/device-status';
import { useQuery } from '@tanstack/react-query';
import { getRelayStatus } from '@/lib/services/relays';
import { DeviceModuleProps } from '@/lib/types/global';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';
import useRelaySwitchMutation from '@/lib/hooks/useRelaySwitchMutation';

const RelayModule = ({ ip, name = 'Relay' }: DeviceModuleProps) => {
  //todo: remove hardcoded devices names too
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

  const handleRelaySwitch = (isChecked: boolean) => {
    console.log(relayStatus, isChecked);
    relaySwitchMutation.mutate({ ip, status: isChecked });
  };

  return (
    <div
      className={`text-foreground ${signalStrength < -90 && 'text-muted-foreground'} bg-card relative flex w-[150px] flex-wrap items-start justify-start gap-x-0 gap-y-4 rounded-md p-4 shadow-md`}
    >
      <DeviceStatus
        isFetching={isFetching}
        error={error}
        rssi={signalStrength}
      />
      <div className='flex w-full flex-wrap gap-x-2'>
        <Split />
        <h3>{name}</h3>
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
  );
};

export default RelayModule;
