interface GetRelayStatusPayload {
  relayStatus: boolean;
  signalStrength: number;
}

//TODO MAKE THIS INTERFACE GLOBAL OR DO SOME WORKAROUND
export interface SetRelayStatusPayload {
  ip: string;
  status: boolean;
}

export const getRelayStatus = async (
  deviceIp: string
): Promise<GetRelayStatusPayload> => {
  const response = await fetch(deviceIp + '/relayStatus');
  if (!response.ok) {
    throw new Error(`Request error! Error status: ${response.status}`);
  }

  return response.json();
};

export const setRelayStatus = async ({ ip, status }: SetRelayStatusPayload) => {
  const response = await fetch(`http://${ip}/relayStatus`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: `state=${status}`,
  });

  if (!response.ok) {
    throw new Error(`Request error! Status: ${response.status}`);
  }
};
