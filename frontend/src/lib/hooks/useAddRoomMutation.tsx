import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { addRoom } from '../services/rooms';

//TODO: Replace mutation hooks with one, that accepts function, messages and queryKey to invalidate
const useAddRoomMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addRoom,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
      toast.success('Room successfully added!');
    },
    onError: error => {
      toast.error('Error: ' + error.message);
    },
  });
};

export default useAddRoomMutation;
