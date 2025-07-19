import { Device, DeviceType } from '@/lib/types/global';
import RelayModule from './RelayModule';
import DHTModule from './DHTModule';

const devicesComponents = {
  [DeviceType.DHTSensor]: DHTModule,
  [DeviceType.Relay]: RelayModule,
};

const DeviceRenderer = ({ name, ip, type }: Device) => {
  const Device = devicesComponents[type];

  return Device ? <Device ip={ip} name={name} /> : <div>Unknown device</div>; //TODO: MAKE BETTER FALLBACK COMPONENT
};

export default DeviceRenderer;
