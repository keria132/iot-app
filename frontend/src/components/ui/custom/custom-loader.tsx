import { Loader } from 'lucide-react';

interface CustomLoaderProps {
  isLoading: boolean;
  isFetching: boolean;
  error: Error | null;
}

const CustomLoader = ({ isLoading, isFetching, error }: CustomLoaderProps) => (
  <div>
    {isFetching || isLoading ? (
      <Loader className='h-10 animate-spin' />
    ) : (
      error && (
        <h3 className='text-destructive flex items-center'>{`Failed to load devices: ${error?.message}`}</h3>
      )
    )}
  </div>
);

export default CustomLoader;
