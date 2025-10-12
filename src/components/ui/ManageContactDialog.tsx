import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@radix-ui/react-label';
import { Input } from './input';
import { useEffect, useState } from 'react';
import { Button } from './button';
import { DialogOverlay } from '@radix-ui/react-dialog';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreateCustomer, useUpdateCustomer } from '@/hooks/use-customers';
import { useParams } from 'next/navigation';
import { toast } from 'sonner';

export enum ContactDialogState {
  CREATE,
  VIEW,
  EDIT,
}

// Zod validation schema
const customerSchema = z.object({
  name: z
    .string()
    .min(1, 'Nome é obrigatório')
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres')
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, 'Nome deve conter apenas letras e espaços'),
  phone: z
    .string()
    .min(1, 'Telefone é obrigatório')
    .regex(
      /^\(?\d{2}\)?[\s-]?\d{4,5}[\s-]?\d{4}$/,
      'Formato inválido. Use: (XX) XXXXX-XXXX ou (XX) XXXX-XXXX'
    ),
});

type CustomerFormData = z.infer<typeof customerSchema>;

interface ManageContactDialogProps {
  state: ContactDialogState;
  customer: {
    id: string;
    name: string;
    phone: string;
  };
  onSuccess?: () => void;
}

export default function ManageContactDialog({
  state,
  customer,
  onSuccess,
}: ManageContactDialogProps) {
  const [dialogState, setDialogState] = useState(ContactDialogState.CREATE);
  const params = useParams();
  const organizationId = params?.organizationId as string;

  const createCustomer = useCreateCustomer();
  const updateCustomer = useUpdateCustomer();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    getValues,
    reset,
  } = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      name: customer?.name || '',
      phone: customer?.phone || '',
    },
  });

  useEffect(() => {
    setDialogState(state);
    // Reset form when customer data changes
    reset({
      name: customer?.name || '',
      phone: customer?.phone || '',
    });
  }, [state, customer, reset]);

  const onSubmit = async (data: CustomerFormData) => {
    if (dialogState === ContactDialogState.CREATE) {
      await createCustomer.mutateAsync(
        {
          organizationId,
          name: data.name,
          phone: data.phone,
        },
        {
          onSuccess: () => {
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
        }
      );
    } else if (dialogState === ContactDialogState.EDIT && customer) {
      await updateCustomer.mutateAsync({
        organizationId: organizationId,
        id: customer.id,
        data,
      });
    }

    setDialogState(ContactDialogState.VIEW);
    onSuccess?.();
  };

  const renderContent = () => {
    switch (dialogState) {
      case ContactDialogState.CREATE:
        return (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className='flex flex-col gap-4'
          >
            <div className='space-y-2'>
              <Label htmlFor='contact-name'>Nome</Label>
              <Input
                id='contact-name'
                type='text'
                placeholder='Digite o nome completo'
                {...register('name')}
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && (
                <span className='text-red-500 text-sm'>
                  {errors.name.message}
                </span>
              )}
            </div>
            <div className='space-y-2'>
              <Label htmlFor='contact-phone'>Telefone</Label>
              <Input
                id='contact-phone'
                type='tel'
                placeholder='(XX) XXXXX-XXXX'
                {...register('phone')}
                className={errors.phone ? 'border-red-500' : ''}
              />
              {errors.phone && (
                <span className='text-red-500 text-sm'>
                  {errors.phone.message}
                </span>
              )}
            </div>
            <div className='flex flex-row gap-2 justify-center mt-4'>
              <Button
                type='submit'
                variant='default'
                size='sm'
                className='w-2/3'
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Criando...' : 'Criar'}
              </Button>
            </div>
          </form>
        );
      case ContactDialogState.VIEW:
        const currentValues = getValues();
        return (
          <div className='flex flex-col gap-4'>
            <div className='space-y-2'>
              <Label>Nome</Label>
              <p className='text-sm font-medium'>
                {currentValues.name || customer?.name}
              </p>
            </div>
            <div className='space-y-2'>
              <Label>Telefone</Label>
              <p className='text-sm font-medium'>
                {currentValues.phone || customer?.phone}
              </p>
            </div>
            <div className='flex flex-row gap-2 justify-center mt-4'>
              <Button
                variant='default'
                size='sm'
                className='w-1/3'
                onClick={() => setDialogState(ContactDialogState.EDIT)}
              >
                Editar
              </Button>
            </div>
          </div>
        );
      case ContactDialogState.EDIT:
        return (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className='flex flex-col gap-4'
          >
            <div className='space-y-2'>
              <Label htmlFor='contact-name'>Nome</Label>
              <Input
                id='contact-name'
                type='text'
                placeholder='Digite o nome completo'
                {...register('name')}
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && (
                <span className='text-red-500 text-sm'>
                  {errors.name.message}
                </span>
              )}
            </div>
            <div className='space-y-2'>
              <Label htmlFor='contact-phone'>Telefone</Label>
              <Input
                id='contact-phone'
                type='tel'
                placeholder='(XX) XXXXX-XXXX'
                {...register('phone')}
                className={errors.phone ? 'border-red-500' : ''}
              />
              {errors.phone && (
                <span className='text-red-500 text-sm'>
                  {errors.phone.message}
                </span>
              )}
            </div>
            <div className='flex flex-row gap-2 justify-center mt-4'>
              <Button
                type='button'
                variant='outline'
                size='sm'
                className='w-1/3'
                onClick={() => setDialogState(ContactDialogState.VIEW)}
              >
                Cancelar
              </Button>
              <Button
                type='submit'
                variant='default'
                size='sm'
                className='w-1/3'
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Salvando...' : 'Salvar'}
              </Button>
            </div>
          </form>
        );
      default:
        return null;
    }
  };

  return (
    <DialogOverlay className='backdrop-blur-sm'>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            <p>Gerenciar Contato</p>
          </DialogTitle>
        </DialogHeader>
        <div className='flex flex-col gap-4 mt-4 p-4'>{renderContent()}</div>
      </DialogContent>
    </DialogOverlay>
  );
}
