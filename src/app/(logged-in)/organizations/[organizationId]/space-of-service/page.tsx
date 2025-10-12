/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus } from 'lucide-react';
import {
  useCreateSpaceOfService,
  useGetSpaceOfServices,
  useUpdateSpaceOfService,
} from '@/hooks/use-space-of-service';
import { SpaceOfService } from '@/lib/api/space-of-services';
import { toast } from 'sonner';
import { useOrganizationId } from '@/hooks/use-organization-id';

const formspaceOfServiceSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2).max(30),
  description: z.string().min(2).max(60),
  createdAt: z.date(),
  updatedAt: z.date().nullable().optional(),
});

export default function SpaceOfServicesPage() {
  const [selectedspaceOfService, setSelectedspaceOfService] =
    useState<SpaceOfService | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [loadedSpaceOfServices, setLoadedSpaceOfServices] = useState<
    SpaceOfService[]
  >([]);

  const createSpaceOfService = useCreateSpaceOfService();
  const updateSpaceOfService = useUpdateSpaceOfService();
  const organizationId = useOrganizationId();
  const { data: spaceOfServices } = useGetSpaceOfServices(organizationId);

  useEffect(() => {
    if (spaceOfServices) {
      setLoadedSpaceOfServices(spaceOfServices);
    }
  }, [spaceOfServices]);

  const form = useForm<z.infer<typeof formspaceOfServiceSchema>>({
    resolver: zodResolver(formspaceOfServiceSchema),
    defaultValues: {
      id: '',
      name: '',
      description: '',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  const { isSubmitting } = form.formState;

  const handlespaceOfServiceChange = (value: string) => {
    if (value === 'new') {
      setIsCreating(true);
      setSelectedspaceOfService(null);
      form.reset({
        name: '',
        description: '',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      return;
    }

    const foundspaceOfService = loadedSpaceOfServices.find(
      (servico) => servico.id.toString() === value
    );

    if (foundspaceOfService) {
      setSelectedspaceOfService({
        id: foundspaceOfService.id,
        name: foundspaceOfService.name,
        description: foundspaceOfService.description,
        createdAt: new Date(foundspaceOfService.createdAt),
        updatedAt: foundspaceOfService.updatedAt
          ? new Date(foundspaceOfService.updatedAt)
          : null,
      });
    }
  };

  const handlespaceOfServiceEdit = () => {
    setIsEditing(true);
    form.reset({
      name: selectedspaceOfService?.name,
      description: selectedspaceOfService?.description,
      createdAt: selectedspaceOfService?.createdAt,
      updatedAt: selectedspaceOfService?.updatedAt,
    });
  };

  const handleCreateSpaceOfService = (
    data: z.infer<typeof formspaceOfServiceSchema>
  ) => {
    if (organizationId) {
      createSpaceOfService.mutate(
        {
          organizationId: organizationId,
          name: data.name,
          description: data.description,
        },
        {
          onSuccess: () => {
            setIsCreating(false);
            setIsEditing(false);
            toast('Espaço de Serviço criado com sucesso', {
              dismissible: true,
              position: 'top-right',
              description: 'Serviço criado com sucesso',
              action: {
                label: 'Fechar',
                onClick: () => console.log('Fechar'),
              },
            });
          },
          onError: (error: any) => {
            const status = error?.response?.status;
            let message = 'Erro ao criar espaço de serviço.';

            if (status === 409) {
              message = 'Espaço de Serviço já existe com este nome.';
            } else if (error?.response?.data?.message) {
              message = error.response.data.message;
            }

            toast.error(message, {
              position: 'top-right',
              description: message,
              action: {
                label: 'Fechar',
                onClick: () => console.log('Fechar'),
              },
            });
          },
        }
      );
    }
  };

  const handleUpdateSpaceOfService = (
    data: z.infer<typeof formspaceOfServiceSchema>
  ) => {
    if (selectedspaceOfService && organizationId) {
      updateSpaceOfService.mutate(
        {
          organizationId: organizationId,
          id: selectedspaceOfService?.id,
          data: {
            name: data.name,
            description: data.description,
          },
        },
        {
          onSuccess: () => {
            setIsEditing(false);
            form.reset({
              name: data.name,
              description: data.description,
              createdAt: selectedspaceOfService.createdAt,
              updatedAt: new Date(),
            });
            setLoadedSpaceOfServices((prev) =>
              prev.map((servico) =>
                servico.id === selectedspaceOfService.id
                  ? {
                      ...servico,
                      name: data.name,
                      description: data.description,
                      updatedAt: new Date(),
                    }
                  : servico
              )
            );
            setSelectedspaceOfService({
              id: selectedspaceOfService.id,
              name: data.name,
              description: data.description,
              createdAt: selectedspaceOfService.createdAt,
              updatedAt: new Date(),
            });
          },
          onError: (error: any) => {
            form.setError('root', {
              type: 'manual',
              message:
                error?.response?.data?.message ||
                'Erro ao criar espaço de serviço.',
            });
          },
        }
      );
    } else {
      form.setError('root', {
        type: 'manual',
        message: 'Erro ao criar espaço de serviço.',
      });
    }
  };

  const onCancel = () => {
    setIsEditing(false);
    setIsCreating(false);
  };

  return (
    <Form {...form}>
      <div className='flex items-center mx-auto max-w-md'>
        <Card className='h-full grid grid-cols-1 gap-4 max-w-[1280px] w-full'>
          <CardHeader>
            <CardTitle className='text-base flex items-center justify-center h-full'>
              Serviços
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isEditing || isCreating ? (
              <form
                onSubmit={form.handleSubmit(
                  isCreating
                    ? handleCreateSpaceOfService
                    : handleUpdateSpaceOfService
                )}
                className='flex flex-col gap-4'
              >
                <Label className='text-sm'>Nome</Label>
                <Input {...form.register('name')} />
                <Label className='text-sm'>Descrição</Label>
                <Input {...form.register('description')} />
                {Object.keys(form.formState.errors).length > 0 && (
                  <div className='text-red-500 text-sm'>
                    <p>Form errors:</p>
                    {Object.entries(form.formState.errors).map(
                      ([key, error]) => (
                        <p key={key}>
                          {key}: {error?.message}
                        </p>
                      )
                    )}
                  </div>
                )}
                <div className='grid grid-cols-2 gap-4'>
                  <Button onClick={() => onCancel()}>Cancelar</Button>
                  <Button type='submit' disabled={isSubmitting}>
                    {isCreating ? 'Criar' : 'Salvar'}
                  </Button>
                </div>
              </form>
            ) : (
              <div className='flex flex-col gap-4'>
                <Select
                  onValueChange={handlespaceOfServiceChange}
                  defaultValue={selectedspaceOfService?.id.toString()}
                >
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder='Selecione um espaço serviço' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='new'>
                      <Plus /> Criar novo espaço
                    </SelectItem>
                    {loadedSpaceOfServices.map((servico) => (
                      <SelectItem
                        key={servico.id}
                        value={servico.id.toString()}
                      >
                        {servico.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Label className='text-sm'>Descrição:</Label>
                {selectedspaceOfService ? (
                  <p className='text-xs'>
                    {selectedspaceOfService.description}
                  </p>
                ) : (
                  <Skeleton className='h-4 w-full' />
                )}
                <Label className='text-sm'>
                  Criado em:{' '}
                  {selectedspaceOfService ? (
                    <p className='text-xs'>
                      {selectedspaceOfService.createdAt
                        ? selectedspaceOfService.createdAt.toLocaleDateString(
                            'pt-BR'
                          )
                        : ''}
                    </p>
                  ) : (
                    <Skeleton className='h-4 w-[78%] ml-auto' />
                  )}
                </Label>
                <Label className='text-sm'>
                  Atualizado em:{' '}
                  {selectedspaceOfService ? (
                    <p className='text-xs'>
                      {selectedspaceOfService.updatedAt
                        ? selectedspaceOfService.updatedAt.toLocaleDateString(
                            'pt-BR'
                          )
                        : 'Nunca'}
                    </p>
                  ) : (
                    <Skeleton className='h-4 w-[70%] ml-auto' />
                  )}
                </Label>

                {selectedspaceOfService && (
                  <div className='grid gap-4'>
                    <Button
                      onClick={() => handlespaceOfServiceEdit()}
                      className='w-full'
                    >
                      Editar
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Form>
  );
}
