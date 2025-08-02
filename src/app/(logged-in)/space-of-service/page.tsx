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
import { Skeleton } from '@/components/ui/skeleton';
import { Plus } from 'lucide-react';

const servicos = [
  {
    id: '1',
    name: 'Espaço pequeno',
    description: 'Um espaço pequeno que suporta uma pessoa',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    name: 'Espaço grande',
    description: 'Um espaço grande que suporta três pessoas',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const formspaceOfServiceSchema = z.object({
  name: z.string().min(2).max(15),
  description: z.string().min(2).max(60),
  createdAt: z.date(),
  updatedAt: z.date(),
});

interface spaceOfService {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

export default function SpaceOfServicesPage() {
  const [selectedspaceOfService, setSelectedspaceOfService] =
    useState<spaceOfService | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const form = useForm<z.infer<typeof formspaceOfServiceSchema>>({
    resolver: zodResolver(formspaceOfServiceSchema),
    defaultValues: {
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

    const foundspaceOfService = servicos.find(
      (servico) => servico.id.toString() === value
    );
    setSelectedspaceOfService({
      id: foundspaceOfService?.id || '',
      name: foundspaceOfService?.name || '',
      description: foundspaceOfService?.description || '',
      createdAt: foundspaceOfService?.createdAt || new Date(),
      updatedAt: foundspaceOfService?.updatedAt || new Date(),
    });
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

  const onSubmit = (data: z.infer<typeof formspaceOfServiceSchema>) => {
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
                className='flex flex-col gap-4'
              >
                <Label className='text-sm'>Nome</Label>
                <Input {...form.register('name')} />
                <Label className='text-sm'>Descrição</Label>
                <Input {...form.register('description')} />
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
                    <SelectValue placeholder='Selecione um serviço' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='new'>
                      <Plus /> Criar novo espaço
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
                      {selectedspaceOfService.createdAt.toLocaleDateString(
                        'pt-BR'
                      )}
                    </p>
                  ) : (
                    <Skeleton className='h-4 w-[78%] ml-auto' />
                  )}
                </Label>
                <Label className='text-sm'>
                  Atualizado em:{' '}
                  {selectedspaceOfService ? (
                    <p className='text-xs'>
                      {selectedspaceOfService.updatedAt.toLocaleDateString(
                        'pt-BR'
                      )}
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
