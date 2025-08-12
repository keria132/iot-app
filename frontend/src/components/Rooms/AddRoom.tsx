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
import { v4 as uuid } from 'uuid';
import useCustomMutation from '@/lib/hooks/useCustomMutation';
import { addRoom } from '@/lib/services/rooms';

const AddRoom = ({ className }: { className: string }) => {
  const addRoomMutation = useCustomMutation({
    mutationFn: addRoom,
    queryKey: ['rooms'],
    successMessage: 'Room successfully added!',
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const { name } = Object.fromEntries(formData.entries());

    //TODO: GET RID OF TYPE CASTING AND ADD VALIDATION
    addRoomMutation.mutate({
      name: name as string,
      uuid: uuid(),
    });
  };

  return (
    <div className={className}>
      <Dialog>
        <DialogTrigger asChild>
          <Button>Add room</Button>
        </DialogTrigger>
        <DialogContent className='w-[400px]'>
          <form className='flex flex-col gap-y-6' onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>Create new room</DialogTitle>
              <DialogDescription>
                Create and add new room to your hub
              </DialogDescription>
            </DialogHeader>
            <div className='flex flex-col gap-4'>
              <div className='flex flex-col gap-2'>
                <Label htmlFor='roomName'>Name</Label>
                <Input id='roomName' name='name' defaultValue='Room 1' />
              </div>
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

export default AddRoom;
