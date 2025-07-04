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
import { newDeviceFields } from './constants';
import useAddDeviceMutation from '@/lib/hooks/useAddDeviceMutation';

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
              {newDeviceFields.map(({ label, id, name, defaultValue }) => (
                <div className='flex flex-col gap-2' key={id}>
                  <Label htmlFor={id}>{label}</Label>
                  <Input id={id} name={name} defaultValue={defaultValue} />
                </div>
              ))}
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
