import AirConditioner from '../Devices/AirConditioner';
import WeatherWidget from './WeatherWidget';

const Dashboard = () => (
  <section className='flex items-start gap-4'>
    <AirConditioner />
    <WeatherWidget />
  </section>
);

export default Dashboard;
