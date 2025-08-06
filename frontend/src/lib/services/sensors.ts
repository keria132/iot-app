interface GetDHTSensorPayload {
  temperature: number;
  humidity: number;
  signalStrength: number;
}

export const getDHTSensorData = async (
  deviceIp: string
): Promise<GetDHTSensorPayload> => {
  const response = await fetch(deviceIp + '/getSensorData');

  if (!response.ok) {
    throw new Error(`Request error! Error status: ${response.status}`);
  }

  return response.json();
};
