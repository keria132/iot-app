import { Split } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getRelayStatus } from '@/lib/services/relays';
import { DeviceModuleProps } from '@/lib/types/global';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';
import useRelaySwitchMutation from '@/lib/hooks/useRelaySwitchMutation';
import DeviceCard from '../ui/custom/device-card';

const RelayModule = ({ ip, name, roomName, roomId }: DeviceModuleProps) => {
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
    <DeviceCard
      name={name}
      ip={ip}
      roomId={roomId}
      roomName={roomName}
      isFetching={isFetching}
      error={error}
      signalStrength={signalStrength}
    >
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
            disabled={signalStrength < -90}
          />
          <Label htmlFor='relay'>{relayStatus ? 'On' : 'Off'}</Label>
        </div>
      </div>
    </DeviceCard>
  );
};

export default RelayModule;
