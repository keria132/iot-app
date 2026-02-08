import { addDeviceSelectOptionsType } from '@/lib/types/global';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '../ui/select';

interface AddDevice {
  label: string;
  name: string;
  id: string;
  placeholder: string;
  selectOptions: addDeviceSelectOptionsType;
}

const AddDeviceSelect = ({ label, name, id, placeholder, selectOptions }: AddDevice) => (
  <div className='flex flex-col gap-2'>
    <Label htmlFor={id}>{label}</Label>
    <Select name={name}>
      <SelectTrigger id={id} className='cursor-pointer'>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent position='popper' modal={false}>
        <SelectGroup>
          <SelectLabel>
            {Object.keys(selectOptions.options).length ? selectOptions.label : 'No rooms available'}
          </SelectLabel>
          {selectOptions.options.map(({ itemName, itemValue }) => (
            <SelectItem className='cursor-pointer' value={itemValue} key={itemValue}>
              {itemName}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  </div>
);

export default AddDeviceSelect;
