import { MAIN_HUB_IP } from '../constants';

interface AddDevicePayload {
  name: string;
  ip: string;
  type: string;
}

export const addDevice = async (device: AddDevicePayload) => {
  console.log('Add new device', device);
  const response = await fetch(MAIN_HUB_IP + '/api/devices', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(device),
  });

  if (!response.ok) {
    throw new Error(`Request error! Error status: ${response.status}`);
  }
};
