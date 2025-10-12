'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetOrganizations } from '@/hooks/use-organizations';
import { Organization } from '@/lib/api/organizations';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Home() {
  const { data: organizations = [], isLoading } = useGetOrganizations();
  const [selectedOrganizationId, setSelectedOrganizationId] = useState<
    string | null
  >(null);

  const router = useRouter();

  const onChange = (value: string) => {
    if (value === 'new') {
      router.push('/new-organization');
    } else {
      setSelectedOrganizationId(value);
      router.push(`/organizations/${value}/inbox`);
    }
  };

  return (
    <Card className='w-sm max-w-sm items-center mx-auto mt-20'>
      <CardHeader className='text-center flex items-center justify-center'>
        <h1 className='font-semibold text-lg whitespace-nowrap'>
          Bem vindo ao Smart Agenda!
        </h1>
      </CardHeader>
      <Separator className='mx-0 w-full' />
      <CardContent>
        <p className='text-center text-sm text-muted-foreground mb-5'>
          Selecione uma organização para começar a gerenciar seus contatos e
          compromissos.
        </p>

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
      </CardContent>
    </Card>
  );
}
