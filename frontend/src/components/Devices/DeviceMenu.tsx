import { EllipsisVertical } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { DeviceModuleProps } from '@/lib/types/global';
import useDeleteDeviceMutation from '@/lib/hooks/useDeleteDeviceMutation';

const DeviceMenu = ({ name, ip }: DeviceModuleProps) => {
  const deleteDeviceMutation = useDeleteDeviceMutation();

  const handleDeleteDevice = () => deleteDeviceMutation.mutate(ip);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <EllipsisVertical className='w-4 cursor-pointer' />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>{name}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleDeleteDevice}
          variant='destructive'
          className='cursor-pointer'
        >
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DeviceMenu;
