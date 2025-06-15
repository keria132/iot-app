import AddDevice from './AddDevice';
import TemperatureModule from './TemperatureModule';

const DevicesPanel = () => (
  <section className='flex flex-wrap gap-4'>
    <AddDevice className='w-full' />
    <TemperatureModule />
  </section>
);

export default DevicesPanel;
