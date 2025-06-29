import { Loader } from 'lucide-react';
import { ReactNode } from 'react';

interface SensorValueProps {
  icon: ReactNode;
  isFetching: boolean;
  error: Error | null;
  value: string;
}

const SensorValue = ({ icon, isFetching, error, value }: SensorValueProps) => (
  <div className='flex w-1/2 flex-col items-center'>
    {icon}
    {isFetching && !error ? (
      <Loader className='h-8 animate-spin' />
    ) : (
      <p className='text-2xl'>{error ? '-' : value}</p>
    )}
  </div>
);

export default SensorValue;
