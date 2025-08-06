import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

const CustomHeading = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => (
  <h2
    className={cn(
      'relative w-full text-lg font-semibold after:relative',
      'after:bottom-0 after:left-0 after:block after:h-1 after:w-6 after:rounded-full after:bg-neutral-50',
      className
    )}
  >
    {children}
  </h2>
);

export default CustomHeading;
