import { MAIN_HUB_IP, RESPONSE_STATUS } from '../constants';

interface AddDevicePayload {
  name: string;
  ip: string;
  type: string;
}

interface Device {
  ip: string;
  name: string;
  online: boolean;
  type: string; //todo: enum type in future
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
    throw new Error(
      `Request error! Status: ${RESPONSE_STATUS[response.status] ?? response.status}`
    );
  }
};

export const getDevices = async (): Promise<Device[]> => {
  const response = await fetch(MAIN_HUB_IP + '/api/devices');

  if (!response.ok) {
    throw new Error(`Request error! Error status: ${response.status}`);
  }

  return response.json();
};
