import { MAIN_HUB_IP, RESPONSE_STATUS } from '../constants';
import { Device } from '../types/global';

interface AddDevicePayload {
  name: string;
  ip: string;
  type: string;
}

export const addDevice = async (device: AddDevicePayload) => {
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
    throw new Error(`Request error! Status: ${response.status}`);
  }

  return response.json();
};

export const deleteDevice = async (deviceIp: string) => {
  const response = await fetch(MAIN_HUB_IP + `/api/devices?ip=${deviceIp}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error(
      `Request error! Status: ${RESPONSE_STATUS[response.status] ?? response.status}`
    );
  }
};
