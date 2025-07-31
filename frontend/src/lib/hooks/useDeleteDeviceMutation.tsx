import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteDevice } from '../services/devices';
import { toast } from 'sonner';

const useDeleteDeviceMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteDevice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['devices'] });
      toast.success('Device successfully deleted!');
    },
    onError: error => {
      toast.error('Error: ' + error.message);
    },
  });
};

export default useDeleteDeviceMutation;
