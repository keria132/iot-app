import { Device, DeviceType } from '@/lib/types/global';
import RelayModule from './RelayModule';
import DHTModule from './DHTModule';

const devicesComponents = {
  [DeviceType.DHTSensor]: DHTModule,
  [DeviceType.Relay]: RelayModule,
};

const DeviceRenderer = ({ name, ip, type }: Device) => {
  const Device = devicesComponents[type];

  return Device ? (
    <Device ip={ip} name={name} />
  ) : (
    <div className='bg-card rounded-md p-4'>
      <h3>Unknown device</h3>
      <p>Name: {name}</p>
      <p>IP: {ip}</p>
      <p>Type: {type}</p>
    </div>
  );
};

export default DeviceRenderer;
