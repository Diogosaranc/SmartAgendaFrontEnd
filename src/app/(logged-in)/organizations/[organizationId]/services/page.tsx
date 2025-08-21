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
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus } from 'lucide-react';
import { Service } from '@/lib/api/services';
import {
  useCreateService,
  useGetServices,
  useUpdateService,
} from '@/hooks/use-services';
import { useParams } from 'next/navigation';
import { toast } from 'sonner';

//implement image support

const formServiceSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: 'O nome deve ter entre 2 e 15 caracteres',
    })
    .max(15, {
      message: 'O nome deve ter entre 2 e 15 caracteres',
    }),
  description: z
    .string()
    .min(2, {
      message: 'A descrição deve ter entre 2 e 60 caracteres',
    })
    .max(60, {
      message: 'A descrição deve ter entre 2 e 60 caracteres',
    }),
  price: z
    .number()
    .min(1, {
      message: 'O preço deve estar entre 1 e 1000',
    })
    .max(1000, {
      message: 'O preço deve estar entre 1 e 1000',
    }),
  duration: z
    .number()
    .min(1, {
      message: 'A duração deve estar entre 1 e 1000',
    })
    .max(1000, {
      message: 'A duração deve estar entre 1 e 1000',
    }),
  observations: z
    .string()
    .min(2, {
      message: 'As observações devem ter entre 2 e 1000 caracteres',
    })
    .max(1000, {
      message: 'As observações devem ter entre 2 e 1000 caracteres',
    }),
  createdAt: z.date().nullable().optional(),
  updatedAt: z.date().nullable().optional(),
});

export default function ServicesPage() {
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [loadedServices, setLoadedServices] = useState<Service[]>([]);

  const createService = useCreateService();
  const updateService = useUpdateService();
  const params = useParams();
  const organizationId = params?.organizationId as string;
  const { data: servicos } = useGetServices(organizationId);

  useEffect(() => {
    if (servicos) {
      setLoadedServices(servicos);
    }
  }, [servicos]);

  const form = useForm<z.infer<typeof formServiceSchema>>({
    resolver: zodResolver(formServiceSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      duration: 0,
      observations: '',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  const { isSubmitting } = form.formState;

  const handleServiceChange = (value: string) => {
    if (value === 'new') {
      setIsCreating(true);
      setSelectedService(null);
      form.reset({
        name: '',
        description: '',
        price: 0,
        duration: 0,
        observations: '',
        createdAt: new Date(),
        updatedAt: null,
      });
      return;
    }

    const foundService = loadedServices.find(
      (servico) => servico.id.toString() === value
    );

    if (foundService) {
      setSelectedService({
        id: foundService.id,
        name: foundService.name || '',
        description: foundService.description || '',
        price: foundService.price || 0,
        duration: foundService.duration || 0,
        observations: foundService.observations || '',
        createdAt: new Date(foundService.createdAt) || new Date(),
        updatedAt: new Date(foundService.updatedAt) || new Date(),
      });
    }
  };

  const handleServiceEdit = () => {
    setIsEditing(true);
    form.reset({
      name: selectedService?.name,
      description: selectedService?.description,
      price: selectedService?.price,
      duration: selectedService?.duration,
      observations: selectedService?.observations || '',
      createdAt: selectedService?.createdAt,
      updatedAt: selectedService?.updatedAt,
    });
  };

  const handleCreateService = (data: z.infer<typeof formServiceSchema>) => {
    if (organizationId) {
      createService.mutate(
        {
          organizationId: organizationId,
          name: data.name,
          description: data.description,
          price: data.price,
          duration: data.duration,
          observations: data.observations,
        },
        {
          onSuccess: () => {
            setIsCreating(false);
            form.reset();
            toast('Serviço criado com sucesso', {
              dismissible: true,
              position: 'top-right',
              description: 'Serviço criado com sucesso',
              action: {
                label: 'Fechar',
                onClick: () => console.log('Fechar'),
              },
            });
          },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onError: (error: any) => {
            const status = error?.response?.status;
            let message = 'Erro ao criar serviço.';

            if (status === 409) {
              message = 'Serviço já existe com este nome.';
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
    } else {
      console.error('Organization ID is missing!');
    }
  };

  const handleUpdateService = (data: z.infer<typeof formServiceSchema>) => {
    if (organizationId) {
      if (!selectedService) {
        toast.error('Serviço não encontrado', {
          position: 'top-right',
          description: 'Serviço não encontrado',
          action: {
            label: 'Fechar',
            onClick: () => console.log('Fechar'),
          },
        });
        return;
      }
      updateService.mutate(
        {
          id: selectedService.id,
          organizationId: organizationId,
          data: {
            name: data.name,
            description: data.description,
            price: data.price,
            duration: data.duration,
            observations: data.observations,
            image: selectedService.image,
          },
        },
        {
          onSuccess: () => {
            setIsEditing(false);
            form.reset({
              name: data.name,
              description: data.description,
              price: data.price,
              duration: data.duration,
              observations: data.observations,
              createdAt: selectedService.createdAt,
              updatedAt: new Date(),
            });
            toast('Serviço atualizado com sucesso', {
              dismissible: true,
              position: 'top-right',
              description: 'Serviço atualizado com sucesso',
              action: {
                label: 'Fechar',
                onClick: () => console.log('Fechar'),
              },
            });
          },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onError: (error: any) => {
            const status = error?.response?.status;
            let message = 'Erro ao criar serviço.';

            if (status === 409) {
              message = 'Serviço já existe com este nome.';
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
    } else {
      console.error('Organization ID is missing!');
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
                onSubmit={form.handleSubmit((data) => {
                  if (isCreating) handleCreateService(data);
                  else handleUpdateService(data);
                })}
                className='flex flex-col gap-3'
              >
                <Label className='text-sm'>Nome</Label>
                <Input {...form.register('name')} />
                <Label className='text-sm'>Descrição</Label>
                <Input {...form.register('description')} />
                <Label className='text-sm'>Preço</Label>
                <Input
                  {...form.register('price', { valueAsNumber: true })}
                  type='number'
                />
                <Label className='text-sm'>Duração</Label>
                <Input
                  {...form.register('duration', { valueAsNumber: true })}
                  type='number'
                />
                <Label className='text-sm'>Observações</Label>
                <Textarea {...form.register('observations')} />
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
              <div className='flex flex-col gap-3'>
                <Select
                  onValueChange={handleServiceChange}
                  defaultValue={selectedService?.id.toString()}
                >
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder='Selecione um serviço' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='new'>
                      <Plus /> Criar novo serviço
                    </SelectItem>
                    {loadedServices.map((servico) => (
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
                {selectedService ? (
                  <p className='text-xs'>{selectedService.description}</p>
                ) : (
                  <Skeleton className='h-4 w-full' />
                )}

                <Label className='text-sm'>Preço:</Label>
                {selectedService ? (
                  <p className='text-xs'>
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    }).format(selectedService.price)}
                  </p>
                ) : (
                  <Skeleton className='h-4 w-full' />
                )}
                <Label className='text-sm'>Duração:</Label>
                {selectedService ? (
                  <p className='text-xs'>{selectedService.duration} minutos</p>
                ) : (
                  <Skeleton className='h-4 w-full' />
                )}
                <Label className='text-sm'>Observações:</Label>
                {selectedService ? (
                  <p className='text-xs'>{selectedService.observations}</p>
                ) : (
                  <Skeleton className='h-4 w-full' />
                )}
                <Label className='text-sm'>
                  Criado em:{' '}
                  {selectedService?.createdAt ? (
                    <p className='text-xs'>
                      {selectedService.createdAt
                        ? selectedService.createdAt.toLocaleDateString('pt-BR')
                        : ''}
                    </p>
                  ) : (
                    <Skeleton className='h-4 w-[78%] ml-auto' />
                  )}
                </Label>
                <Label className='text-sm'>
                  Atualizado em:{' '}
                  {selectedService?.updatedAt ? (
                    <p className='text-xs'>
                      {selectedService.updatedAt
                        ? selectedService.updatedAt.toLocaleDateString('pt-BR')
                        : ''}
                    </p>
                  ) : (
                    <Skeleton className='h-4 w-[70%] ml-auto' />
                  )}
                </Label>
                {selectedService && (
                  <div className='grid gap-4'>
                    <Button
                      onClick={() => handleServiceEdit()}
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
