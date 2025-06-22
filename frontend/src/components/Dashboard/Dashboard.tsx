import AirConditioner from '../Devices/AirConditioner';
import DHTModule from '../Devices/DHTModule';
import WeatherWidget from './WeatherWidget';

const Dashboard = () => (
  <section className='flex items-start gap-4'>
    <AirConditioner />
    <WeatherWidget />
    <DHTModule ip='http://192.168.0.100' />
  </section>
);

export default Dashboard;
