'use client';

import {
  Calendar,
  Home,
  Inbox,
  CalendarDays,
  Settings,
  Calendar1,
  LogOut,
  Bell,
  User,
  EllipsisVerticalIcon,
  SquareChartGantt,
  Warehouse,
  Building,
} from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import ThemeToggle from '@/components/ui/theme-toggle';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './select';

// Menu items.
const items = [
  {
    title: 'Home',
    url: '/home',
    icon: Home,
  },
  {
    title: 'Inbox',
    url: '/inbox',
    icon: Inbox,
  },
  {
    title: 'Calendário',
    url: '/calendar',
    icon: CalendarDays,
  },
  {
    title: 'Agendamento',
    url: '/schedule',
    icon: Calendar,
  },
  {
    title: 'Serviços',
    url: '/services',
    icon: SquareChartGantt,
  },
  {
    title: 'Espaço de Serviço',
    url: '/space-of-service',
    icon: Warehouse,
  },
];

const user = {
  name: 'Diogo Saran',
  email: 'diogosaran@example.com',
  avatar: 'https://github.com/xdiogoxd.png',
};

type AppSidebarProps = {
  className?: string;
  onNavigate?: () => void;
};

export default function AppSidebar({ className }: AppSidebarProps) {
  const pathName = usePathname();

  return (
    <Sidebar className={cn('flex flex-col h-full', className)}>
      <SidebarHeader>
        <SidebarMenu className='flex flex-col gap-2 items-center'>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className='data-[slot=sidebar-menu-button]:!p-1.5'
            >
              <Link href='#'>
                <Calendar1 size={25} color='var(--primary)' />
                <h3 className='font-bold'>Smart Agenda</h3>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarSeparator className='mx-0 w-full' />
        <Select>
          <SelectTrigger className='w-full'>
            <SelectValue placeholder='Organizações' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='option1'>Harmonie</SelectItem>
            <SelectItem value='option2'>Didi Corp</SelectItem>
          </SelectContent>
        </Select>
      </SidebarHeader>
      <SidebarContent className='flex-grow'>
        <nav>
          <SidebarGroup>
            <SidebarGroupLabel>Navegação</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={pathName === item.url}>
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </nav>
      </SidebarContent>

      <SidebarFooter className='mt-auto pb-5'>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className='flex w-full justify-end mb-1'>
              <ThemeToggle />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size='lg'
                  className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
                >
                  <Avatar className='h-8 w-8 rounded-lg grayscale'>
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className='rounded-lg'>CN</AvatarFallback>
                  </Avatar>
                  <div className='grid flex-1 text-left text-sm leading-tight'>
                    <span className='truncate font-medium'>{user.name}</span>
                    <span className='text-muted-foreground truncate text-xs'>
                      {user.email}
                    </span>
                  </div>

                  <EllipsisVerticalIcon className='ml-auto size-4' />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <nav>
                <DropdownMenuContent
                  className='w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg'
                  // side={isMobile ? 'bottom' : 'right'}
                  align='end'
                  sideOffset={4}
                >
                  <DropdownMenuLabel className='p-0 font-normal'>
                    <div className='flex items-center gap-2 px-1 py-1.5 text-left text-sm'>
                      <Avatar className='h-8 w-8 rounded-lg'>
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback className='rounded-lg'>
                          DS
                        </AvatarFallback>
                      </Avatar>
                      <div className='grid flex-1 text-left text-sm leading-tight'>
                        <span className='truncate font-medium'>
                          {user.name}
                        </span>
                        <span className='text-muted-foreground truncate text-xs'>
                          {user.email}
                        </span>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem>
                      <Link
                        href='/account'
                        className='flex items-center gap-2 w-full'
                      >
                        <User size={18} />
                        Conta
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link
                        href='/organizations'
                        className='flex items-center gap-2 w-full'
                      >
                        <Building size={18} />
                        Organizações
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link
                        href='/notifications'
                        className='flex items-center gap-2 w-full'
                      >
                        <Bell size={18} />
                        Notificações
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link
                        href='/settings'
                        className='flex items-center gap-2 w-full'
                      >
                        <Settings />
                        Configurações
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Link href='/' className='flex items-center gap-2 w-full'>
                      <LogOut />
                      Log out
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </nav>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
