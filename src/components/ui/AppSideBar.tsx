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
  Plus,
  Contact,
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
import { useParams, usePathname } from 'next/navigation';
import Link from 'next/link';

import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './select';
import { useRouter } from 'next/navigation';
import { useGetOrganizations } from '@/hooks/use-organizations';
import type { Organization } from '@/lib/api/organizations';
import { Skeleton } from './skeleton';
import { getInitials } from '@/lib/get-initals';
import { useGetUser } from '@/hooks/use-user';
import { useEffect, useState } from 'react';

type AppSidebarProps = {
  className?: string;
  onNavigate?: () => void;
};

//todo: support avatarUrl

export default function AppSidebar({ className }: AppSidebarProps) {
  const pathName = usePathname();
  const params = useParams();
  const router = useRouter();
  const { data: organizations = [], isLoading } = useGetOrganizations();
  const { data: user } = useGetUser();
  const [selectedOrganizationId, setSelectedOrganizationId] = useState<
    string | null
  >(null);

  useEffect(() => {
    if (params?.organizationId) {
      setSelectedOrganizationId(params.organizationId.toString());
    }
  }, [params?.organizationId]);

  const initials = getInitials(user?.name);

  const avatarUrl = 'https://github.com/xdiogoxd.png';

  const items = [
    {
      title: 'Home',
      url: '/home',
      icon: Home,
    },
    {
      title: 'Inbox',
      url: `/organizations/${selectedOrganizationId}/inbox`,
      icon: Inbox,
    },
    {
      title: 'Agenda',
      url: `/organizations/${selectedOrganizationId}/agenda`,
      icon: Calendar1,
    },
    {
      title: 'Calendário',
      url: `/organizations/${selectedOrganizationId}/calendar`,
      icon: CalendarDays,
    },
    {
      title: 'Contatos',
      url: `/organizations/${selectedOrganizationId}/contacts`,
      icon: Contact,
    },
    {
      title: 'Agendamento',
      url: `/organizations/${selectedOrganizationId}/schedule`,
      icon: Calendar,
    },
    {
      title: 'Serviços',
      url: `/organizations/${selectedOrganizationId}/services`,
      icon: SquareChartGantt,
    },
    {
      title: 'Espaço de Serviço',
      url: `/organizations/${selectedOrganizationId}/space-of-service`,
      icon: Warehouse,
    },
  ];

  const onChange = (value: string) => {
    if (value === 'new') {
      router.push('/new-organization');
    } else {
      setSelectedOrganizationId(value);
      router.push(`/organizations/${value}/inbox`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    router.push('/log-in');
  };

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
        <Select onValueChange={onChange} value={selectedOrganizationId || ''}>
          <SelectTrigger className='w-full cursor-pointer'>
            <SelectValue placeholder='Organizações' />
          </SelectTrigger>
          <SelectContent>
            {isLoading ? (
              <SelectItem value='loading' disabled>
                <Skeleton className='w-full h-8' />
              </SelectItem>
            ) : (
              organizations.map((organization: Organization) => (
                <SelectItem
                  key={organization.id}
                  value={organization.id}
                  className='cursor-pointer'
                >
                  {organization.name}
                </SelectItem>
              ))
            )}
            <SelectItem value='new' className='cursor-pointer'>
              <Plus />
              Nova organização
            </SelectItem>
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
                    {user ? (
                      <AvatarImage src={avatarUrl} alt={user.name} />
                    ) : (
                      <AvatarFallback className='rounded-lg'>
                        {initials}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  {user ? (
                    <div className='grid flex-1 text-left text-sm leading-tight'>
                      <span className='truncate font-medium'>{user.name}</span>
                      <span className='text-muted-foreground truncate text-xs'>
                        {user.email}
                      </span>
                    </div>
                  ) : (
                    <div className='grid flex-1 text-left text-sm leading-tight space-y-1'>
                      <Skeleton className='h-6 w-30 rounded-lg' />
                      <Skeleton className='h-4 w-24 rounded-lg' />
                    </div>
                  )}

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
                    {user ? (
                      <div className='flex items-center gap-2 px-1 py-1.5 text-left text-sm'>
                        <Avatar className='h-8 w-8 rounded-lg'>
                          <AvatarImage src={avatarUrl} alt={user.name} />
                          <AvatarFallback className='rounded-lg'>
                            {initials}
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
                    ) : (
                      <div className='flex items-center gap-2 px-1 py-1.5 text-left text-sm'>
                        <Avatar className='h-8 w-8 rounded-lg'>
                          <AvatarFallback className='rounded-lg'>
                            {initials}
                          </AvatarFallback>
                        </Avatar>
                        <div className='grid flex-1 text-left text-sm leading-tight space-y-1'>
                          <Skeleton className='h-8 w-30 rounded-lg' />
                          <Skeleton className='h-4 w-24 rounded-lg' />
                        </div>
                      </div>
                    )}
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
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut />
                    Log out
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
