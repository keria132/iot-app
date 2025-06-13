const DeviceStatus = ({ status }: { status: boolean }) => (
  <div
    className={`bg-destructive ${status && 'bg-green-600'} absolute top-2 right-3 h-2 w-2 rounded-full`}
  />
);

export default DeviceStatus;
