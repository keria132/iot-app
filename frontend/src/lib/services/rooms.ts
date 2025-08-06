import { defaultHeaders, MAIN_HUB_IP, RESPONSE_STATUS } from '../constants';
import { Room } from '../types/global';

interface AddRoomPayload {
  name: string;
  uuid: string;
}

interface AssignRoomPayload {
  deviceIp: string;
  roomId: string;
}

export const getRooms = async (): Promise<Room[]> => {
  const response = await fetch(MAIN_HUB_IP + '/api/rooms');

  if (!response.ok) {
    throw new Error(`Request error! Status: ${response.status}`);
  }

  return response.json();
};

export const addRoom = async (room: AddRoomPayload) => {
  const response = await fetch(MAIN_HUB_IP + '/api/rooms', {
    method: 'POST',
    headers: defaultHeaders,
    body: JSON.stringify(room),
  });

  if (!response.ok) {
    throw new Error(
      `Request error! Status: ${RESPONSE_STATUS[response.status] ?? response.status + response.statusText}`
    );
  }
};

export const assignRoom = async (payload: AssignRoomPayload) => {
  const response = await fetch(MAIN_HUB_IP + '/api/assign-room', {
    method: 'POST',
    headers: defaultHeaders,
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(
      `Request error! Status: ${RESPONSE_STATUS[response.status] ?? response.status + response.statusText}`
    );
  }
};
