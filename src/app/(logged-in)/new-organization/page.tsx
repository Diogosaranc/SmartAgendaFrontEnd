'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Building } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCreateOrganization } from '@/hooks/use-organizations';

//todo: add a popup with success/error
//todo: add missing fields of organization

const formCreateOrganizationchema = z.object({
  name: z.string().min(2).max(15),
  // description: z.string().min(2).max(60),
});

export default function CreateOrganizationPage() {
  const form = useForm<z.infer<typeof formCreateOrganizationchema>>({
    resolver: zodResolver(formCreateOrganizationchema),
    defaultValues: {
      name: '',
      // description: '',
    },
  });

  const { isSubmitting } = form.formState;
  const router = useRouter();
  const createOrganization = useCreateOrganization();

  function handleCreateOrganization(
    data: z.infer<typeof formCreateOrganizationchema>
  ) {
    createOrganization.mutate(
      {
        name: data.name,
      },
      {
        onSuccess: () => {
          console.log('Organization created successfully!');
          router.push('/home');
        },
        onError: (error: any) => {
          console.error('Error creating organization:', error);
          form.setError('root', {
            type: 'manual',
            message:
              error?.response?.data?.message ||
              'Erro ao criar organização. Tente novamente.',
          });
        },
      }
    );
  }

  return (
    <Form {...form}>
      <div className='flex items-center mx-auto max-w-md'>
        <Card className='h-full grid grid-cols-1 gap-4 max-w-[1280px] w-full'>
          <CardHeader>
            <CardTitle className='text-base flex items-center justify-center h-full'>
              <Building className='mr-2' size={20} />
              Criar organização <Building className='ml-2' size={20} />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={form.handleSubmit(handleCreateOrganization)}
              className='flex flex-col gap-4'
            >
              <Label className='text-sm'>Nome</Label>
              <Input {...form.register('name')} />
              {/* <Label className='text-sm'>Descrição</Label>
              <Input {...form.register('description')} /> */}
              <div className='grid'>
                <Button type='submit' disabled={isSubmitting}>
                  {createOrganization.isPending ? 'Criando...' : 'Criar'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </Form>
  );
}
