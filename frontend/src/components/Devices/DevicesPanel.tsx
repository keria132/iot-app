import AddDevice from './AddDevice';
import DHTModule from './DHTModule';

const DevicesPanel = () => (
  <section className='flex flex-wrap gap-4'>
    <AddDevice className='w-full' />
    <DHTModule ip='http://192.168.0.100' />
  </section>
);

export default DevicesPanel;
