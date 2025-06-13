import Header from '@/components/Header/Header';
import Home from '@/components/Home/Home';

export default function Main() {
  return (
    <div className='bg-background h-screen w-full text-white'>
      <Header />
      <main className='container m-auto mt-6'>
        <Home />
        <p></p>
      </main>
    </div>
  );
}
