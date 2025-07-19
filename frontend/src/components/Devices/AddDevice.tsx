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
import { newDeviceInputFields } from './constants';
import useAddDeviceMutation from '@/lib/hooks/useAddDeviceMutation';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { DeviceType } from '@/lib/types/global';

const AddDevice = ({ className }: { className?: string }) => {
  const addDeviceMutation = useAddDeviceMutation();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const { name, ip, type } = Object.fromEntries(formData.entries());

    //TODO: DO A SOLID VALIDATION HERE, GET RID OF TYPE CASTING
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
              <Label htmlFor='deviceType'>Device type</Label>
              <Select name='type'>
                <SelectTrigger id='deviceType' className='cursor-pointer'>
                  <SelectValue placeholder='Select device type' />
                </SelectTrigger>
                <SelectContent position='popper' modal={false}>
                  <SelectGroup>
                    <SelectLabel>Device types</SelectLabel>
                    <SelectItem
                      className='cursor-pointer'
                      value={DeviceType.DHTSensor}
                    >
                      DHT Sensor
                    </SelectItem>
                    <SelectItem
                      className='cursor-pointer'
                      value={DeviceType.Relay}
                    >
                      Relay
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant='outline'>Cancel</Button>
              </DialogClose>
              <Button type='submit'>Add</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddDevice;
