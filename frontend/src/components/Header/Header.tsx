import { Avatar, AvatarFallback, AvatarImage } from '@ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@ui/dropdown-menu';
import { Button } from '@ui/button';
import { Bell } from 'lucide-react';
import ThemeSwitch from './ThemeSwitch';

const Header = () => (
  <header className='text-foreground container m-auto flex justify-between p-4'>
    <h1 className='text-3xl font-semibold'>Dashboard</h1>
    <div className='flex items-center gap-2'>
      <ThemeSwitch />
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant='outline' size='icon'>
            <Bell />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Notifications</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Increase</DropdownMenuItem>
          <DropdownMenuItem>Decrease</DropdownMenuItem>
          <DropdownMenuItem>Team</DropdownMenuItem>
          <DropdownMenuItem>Subscription</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Avatar className='ml-2'>
        <AvatarImage src='https://github.com/shadcn.png' />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <p>Jarvis</p>
    </div>
  </header>
);

export default Header;
