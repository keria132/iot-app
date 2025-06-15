import Dashboard from '@/components/Dashboard/Dashboard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { navigationItems } from './constants';
import DevicesPanel from '../Devices/DevicesPanel';

const Home = () => (
  <Tabs defaultValue='Dashboard' className='gap-y-8'>
    <TabsList variant='outline'>
      {navigationItems.map(({ name }, index) => (
        <TabsTrigger key={index} value={name} className='p-4'>
          {name}
        </TabsTrigger>
      ))}
    </TabsList>
    <TabsContent value='Dashboard'>
      <Dashboard />
    </TabsContent>
    <TabsContent value='Devices'>
      <DevicesPanel />
    </TabsContent>
  </Tabs>
);

export default Home;
