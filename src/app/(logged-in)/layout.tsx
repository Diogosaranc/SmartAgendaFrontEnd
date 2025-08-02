'use client';

import MenuTitle from '@/components/ui/MenuTitle';
import AppSidebar from '../../components/ui/AppSideBar';
import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
  useSidebar,
} from '@/components/ui/sidebar';

type Props = {
  children: React.ReactNode;
};

function LayoutContent({ children }: Props) {
  const { isMobile } = useSidebar();

  const date = new Date();
  const formattedDate = date.toLocaleDateString('pt-BR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <>
      <AppSidebar />
      <SidebarInset>
        {isMobile && (
          <div className='p-4 flex items-center sticky top-0 left-0 bg-background border-b border-border'>
            <SidebarTrigger />
            <div className='flex-1 flex justify-center'>
              <MenuTitle />
            </div>
          </div>
        )}
        <div className='flexflex-col h-full p-4 w-full max-w-full'>
          <h2 className='pb-4 w-full text-center'>
            Olá Diogo, {formattedDate}
          </h2>
          <div className='flex-1 overflow-auto w-full max-w-full'>
            {children}
          </div>
        </div>
      </SidebarInset>
    </>
  );
}

export default function LoggedInLayout({ children }: Props) {
  return (
    <SidebarProvider>
      <LayoutContent>{children}</LayoutContent>
    </SidebarProvider>
  );
}
