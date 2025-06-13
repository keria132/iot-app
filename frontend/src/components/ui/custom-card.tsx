import { ReactNode } from 'react';

const CustomCard = ({ children }: { children: ReactNode }) => (
  <div className='text-foreground bg-card flex w-[250px] flex-wrap items-center justify-between gap-4 rounded-md p-4 shadow-md'>
    {children}
  </div>
);

export default CustomCard;
