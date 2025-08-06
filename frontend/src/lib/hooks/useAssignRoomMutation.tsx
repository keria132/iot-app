import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { assignRoom } from '../services/rooms';
import { Device } from '../types/global';

const useAssignRoomMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: assignRoom,
    onSuccess: (_, { deviceIp, roomId }) => {
      queryClient.setQueryData<Device[]>(['devices'], oldDevices =>
        oldDevices?.map(device =>
          device.ip === deviceIp ? { ...device, roomId } : device
        )
      );

      queryClient.invalidateQueries({ queryKey: ['devices'] });
      toast.success('Room assigned successfully!');
    },
    onError: error => {
      toast.error('Error: ' + error.message);
    },
  });
};

export default useAssignRoomMutation;
