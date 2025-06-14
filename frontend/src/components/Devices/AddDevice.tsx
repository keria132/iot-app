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

const AddDevice = ({ className }: { className?: string }) => (
  <Dialog>
    <form className={className}>
      <DialogTrigger asChild>
        <Button>Add device</Button>
      </DialogTrigger>
      <DialogContent className='w-[400px] gap-y-6'>
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
      </DialogContent>
    </form>
  </Dialog>
);

export default AddDevice;
