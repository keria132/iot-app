import { EllipsisVertical } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { DeviceModuleProps } from '@/lib/types/global';
import { useQuery } from '@tanstack/react-query';
import { roomsQueryOptions } from '@/lib/constants';
import useAssignRoomMutation from '@/lib/hooks/useAssignRoomMutation';
import useCustomMutation from '@/lib/hooks/useCustomMutation';
import { deleteDevice } from '@/lib/services/devices';

const DeviceMenu = ({ name, ip, roomId }: Omit<DeviceModuleProps, 'roomName'>) => {
  const { data: rooms = [] } = useQuery(roomsQueryOptions());
  const deleteDeviceMutation = useCustomMutation({
    mutationFn: deleteDevice,
    queryKey: ['devices'],
    successMessage: 'Device successfully deleted!',
  });
  const assignRoomMutation = useAssignRoomMutation();

  const handleDeleteDevice = () => deleteDeviceMutation.mutate(ip);

  const handleAssignRoom = (uuid: string) => assignRoomMutation.mutate({ deviceIp: ip, roomId: uuid });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <EllipsisVertical className='w-4 cursor-pointer' />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>{name}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Assign room</DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              {rooms.map(({ name, uuid }) => (
                <DropdownMenuCheckboxItem
                  key={uuid}
                  checked={roomId === uuid}
                  className='cursor-pointer'
                  onClick={() => handleAssignRoom(uuid)}
                >
                  {name}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
        <DropdownMenuItem
          onClick={handleDeleteDevice}
          className='text-destructive focus:bg-destructive/10 cursor-pointer'
        >
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DeviceMenu;
