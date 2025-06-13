import AirConditioner from '../Devices/AirConditioner';
import TemperatureModule from '../Devices/TemperatureModule';
import WeatherWidget from '../Devices/WeatherWidget';

const Dashboard = () => (
  <section className='flex items-start gap-4'>
    <AirConditioner />
    <WeatherWidget />
    <TemperatureModule />
  </section>
);

export default Dashboard;
