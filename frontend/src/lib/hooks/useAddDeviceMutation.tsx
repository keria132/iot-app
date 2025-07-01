import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addDevice } from '../services/devices';
import { toast } from 'sonner';

const useAddDeviceMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addDevice,
    onSuccess: () => {
      // Invalidate device list to re-fetch updated data
      queryClient.invalidateQueries({ queryKey: ['devices'] });
      toast.success('Device successfully added!');
    },
    onError: error => {
      toast.error('Error: ' + error.message);
    },
  });
};

export default useAddDeviceMutation;
