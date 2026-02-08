'use client';

import { FormEvent, useMemo } from 'react';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { deviceInputFields, deviceTypeSelectOptions } from './constants';
import AddDeviceSelect from './AddDeviceSelect';
import useCustomMutation from '@/lib/hooks/useCustomMutation';
import { addDevice } from '@/lib/services/devices';
import { AddDeviceSchema } from '@/lib/schemas';
import { toast } from 'sonner';
import { validateFormData } from '@/lib/helpers/validateFormData';
import { useQuery } from '@tanstack/react-query';
import { roomsQueryOptions } from '@/lib/constants';

const AddDevice = ({ className }: { className?: string }) => {
  const addDeviceMutation = useCustomMutation({
    mutationFn: addDevice,
    queryKey: ['devices'],
    successMessage: 'Device successfully added!',
  });
  const { data: rooms = [] } = useQuery(roomsQueryOptions());

  const deviceRoomSelectItems = useMemo(
    () => ({
      label: 'Available rooms',
      options: rooms.map(({ name, uuid }) => ({
        itemName: name,
        itemValue: uuid,
      })),
    }),
    [rooms]
  );

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const parsed = validateFormData(formData, AddDeviceSchema);
    if (!parsed.status) {
      toast.error(parsed.error);

      return;
    }

    addDeviceMutation.mutate(parsed.data);
  };

  return (
    <div className={className}>
      <Dialog>
        <DialogTrigger asChild>
          <Button>Add device</Button>
        </DialogTrigger>
        <DialogContent className='w-[400px]'>
          <form className='flex flex-col gap-y-6' onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>Add new device to the hub</DialogTitle>
              <DialogDescription>Add new device to the hub</DialogDescription>
            </DialogHeader>
            <div className='flex flex-col gap-4'>
              {deviceInputFields.map(({ label, id, name, defaultValue }) => (
                <div className='flex flex-col gap-2' key={id}>
                  <Label htmlFor={id}>{label}</Label>
                  <Input id={id} name={name} defaultValue={defaultValue} />
                </div>
              ))}
              <AddDeviceSelect
                label='Device type'
                name='type'
                id='deviceType'
                placeholder='Select device type'
                selectOptions={deviceTypeSelectOptions}
              />
              <AddDeviceSelect
                label='Assign to room'
                name='room'
                id='roomName'
                placeholder='Select available room'
                selectOptions={deviceRoomSelectItems}
              />
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant='outline'>Cancel</Button>
              </DialogClose>
              <DialogClose asChild>
                <Button type='submit'>Add</Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddDevice;
