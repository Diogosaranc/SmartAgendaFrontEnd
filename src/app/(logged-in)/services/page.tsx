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
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus } from 'lucide-react';

const servicos = [
  {
    id: '1',
    name: 'Spa comum',
    description: 'Descrição do spa comum',
    price: 100,
    duration: 60,
    observations: 'Nenhuma observação',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    name: 'Spa VIP',
    description: 'Descrição do spa VIP',
    price: 200,
    duration: 90,
    observations: 'Nenhuma observação',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

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
  createdAt: z.date(),
  updatedAt: z.date(),
});

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  observations: string;
  createdAt: Date;
  updatedAt: Date;
}

export default function ServicesPage() {
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

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
        updatedAt: new Date(),
      });
      return;
    }

    const foundService = servicos.find(
      (servico) => servico.id.toString() === value
    );
    setSelectedService({
      id: foundService?.id || '',
      name: foundService?.name || '',
      description: foundService?.description || '',
      price: foundService?.price || 0,
      duration: foundService?.duration || 0,
      observations: foundService?.observations || '',
      createdAt: foundService?.createdAt || new Date(),
      updatedAt: foundService?.updatedAt || new Date(),
    });
  };

  const handleServiceEdit = () => {
    setIsEditing(true);
    form.reset({
      name: selectedService?.name,
      description: selectedService?.description,
      price: selectedService?.price,
      duration: selectedService?.duration,
      observations: selectedService?.observations,
      createdAt: selectedService?.createdAt,
      updatedAt: selectedService?.updatedAt,
    });
  };

  const onSubmit = (data: z.infer<typeof formServiceSchema>) => {
    form.reset({
      updatedAt: new Date(),
    });
    console.log(data);
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
                onSubmit={form.handleSubmit(onSubmit)}
                className='flex flex-col gap-3'
              >
                <Label className='text-sm'>Nome</Label>
                <Input {...form.register('name')} />
                <Label className='text-sm'>Descrição</Label>
                <Input {...form.register('description')} />
                <Label className='text-sm'>Preço</Label>
                <Input {...form.register('price')} type='number' />
                <Label className='text-sm'>Duração</Label>
                <Input {...form.register('duration')} type='number' />
                <Label className='text-sm'>Observações</Label>
                <Textarea {...form.register('observations')} />
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
                    {servicos.map((servico) => (
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
                <Label className='text-sm'>Observações:</Label>
                {selectedService ? (
                  <p className='text-xs'>{selectedService.observations}</p>
                ) : (
                  <Skeleton className='h-4 w-full' />
                )}
                <Label className='text-sm'>
                  Criado em:{' '}
                  {selectedService ? (
                    <p className='text-xs'>
                      {selectedService.createdAt.toLocaleDateString('pt-BR')}
                    </p>
                  ) : (
                    <Skeleton className='h-4 w-[78%] ml-auto' />
                  )}
                </Label>
                <Label className='text-sm'>
                  Atualizado em:{' '}
                  {selectedService ? (
                    <p className='text-xs'>
                      {selectedService.updatedAt.toLocaleDateString('pt-BR')}
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
