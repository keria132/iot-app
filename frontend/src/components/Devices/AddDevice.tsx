'use client';

import { FormEvent } from 'react';
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
import {
  mockNewDeviceTypeSelectItems,
  newDeviceInputFields,
  newDeviceTypeSelectItems,
} from './constants';
import AddDeviceSelect from './AddDeviceSelect';
import useCustomMutation from '@/lib/hooks/useCustomMutation';
import { addDevice } from '@/lib/services/devices';

const AddDevice = ({ className }: { className?: string }) => {
  const addDeviceMutation = useCustomMutation({
    mutationFn: addDevice,
    queryKey: ['devices'],
    successMessage: 'Device successfully added!',
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const { name, ip, type } = Object.fromEntries(formData.entries());

    //TODO: GET RID OF TYPE CASTING AND ADD VALIDATION
    addDeviceMutation.mutate({
      name: name as string,
      ip: ip as string,
      type: type as string,
    });
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
              {newDeviceInputFields.map(({ label, id, name, defaultValue }) => (
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
                itemsGroup={newDeviceTypeSelectItems}
              />
              {/* TODO: list rooms to assign and handle the assign request */}
              <AddDeviceSelect
                label='Assign to room'
                name='room'
                id='roomName'
                placeholder='Select available room'
                itemsGroup={mockNewDeviceTypeSelectItems}
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
