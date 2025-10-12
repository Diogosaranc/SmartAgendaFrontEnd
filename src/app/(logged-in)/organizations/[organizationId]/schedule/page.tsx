'use client';

import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { MultiStep } from '@/components/ui/MultiStep';
import ScheduleCalendar from '@/components/ui/ScheduleCalendar';
import { SpaceOfService } from '@/lib/api/space-of-services';
import { Service } from '@/lib/api/services';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useGetSpaceOfServices } from '@/hooks/use-space-of-service';
import { useGetServices } from '@/hooks/use-services';
import { useCreateAppointment } from '@/hooks/use-appointments';
import { Controller, useForm, UseFormReturn } from 'react-hook-form';
import z from 'zod';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { useOrganizationId } from '@/hooks/use-organization-id';
import SelectContact from './components/SelectContact';
import { Contact } from 'lucide-react';
import { Customer } from '@/lib/api/customers';

const formAppointmentSchema = z.object({
  service: z.string().min(1, 'Serviço é obrigatório'),
  spaceOfService: z.string().min(1, 'Espaço de serviço é obrigatório'),
  customerPhone: z.string().min(8, 'Cliente é obrigatório'),
  customerLabel: z.string().optional(),
  date: z.date().min(new Date(), 'Data é obrigatória'),
  description: z.string().optional(),
});

export default function SchedulePage() {
  const [available, setAvailable] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const createAppointment = useCreateAppointment();

  const form = useForm<z.infer<typeof formAppointmentSchema>>({
    resolver: zodResolver(formAppointmentSchema),
    defaultValues: {
      service: '',
      spaceOfService: '',
      customerPhone: '',
      customerLabel: '',
      date: new Date(),
      description: '',
    },
  });

  const steps = 3;

  const organizationId = useOrganizationId();

  const handleCreateAppointment = () => {
    if (organizationId) {
      createAppointment.mutate(
        {
          organizationId,
          data: {
            date: form.getValues('date'),
            description: form.getValues('description')
              ? form.getValues('description')
              : '',
            serviceId: form.getValues('service'),
            spaceOfServiceId: form.getValues('spaceOfService'),
            customerPhone: form.getValues('customerPhone'),
          },
        },
        {
          onSuccess: () => {
            form.reset();
            toast('Agenda criada com sucesso', {
              dismissible: true,
              position: 'top-right',
              description: 'Agenda criada com sucesso',
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
  return (
    <Card className='max-w-xl mx-auto mt-0'>
      <CardHeader className='text-center'>
        <h1 className='text-2xl font-bold'>Agendamento</h1>
      </CardHeader>
      <CardContent className='space-y-4'>
        <MultiStep size={steps} currentStep={currentStep} />
        <Separator className='my-4' />
        {currentStep === 1 && <StepOne form={form} />}
        {currentStep === 2 && (
          <StepTwo
            form={form}
            available={available}
            setAvailable={setAvailable}
          />
        )}
        {currentStep === 3 && <StepThree form={form} />}

        <div className='flex gap-2'>
          {currentStep > 1 && (
            <Button
              variant='outline'
              onClick={() => setCurrentStep(currentStep - 1)}
            >
              Voltar
            </Button>
          )}
          {currentStep < steps ? (
            <Button
              className='flex-1'
              onClick={() => {
                setCurrentStep(currentStep + 1);
              }}
              disabled={currentStep === 2 && available}
            >
              Próximo
            </Button>
          ) : (
            <Button
              className='flex-1'
              variant='default'
              onClick={handleCreateAppointment}
            >
              Agendar
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

interface StepProps {
  form: UseFormReturn<{
    service: string;
    spaceOfService: string;
    customerPhone: string;
    customerLabel?: string;
    date: Date;
    description?: string;
  }>;
  available?: boolean;
  setAvailable?: (available: boolean) => void;
}

function StepOne({ form }: StepProps) {
  const [loadedSpaceOfServices, setLoadedSpaceOfServices] = useState<
    SpaceOfService[]
  >([]);
  const [loadedServices, setLoadedServices] = useState<Service[]>([]);

  const organizationId = useOrganizationId();

  const { data: spaceOfServices } = useGetSpaceOfServices(organizationId);
  const { data: services } = useGetServices(organizationId);

  const onSelectCustomer = (customer: Customer) => {
    form.setValue('customerPhone', customer.phone);
    form.setValue('customerLabel', customer.name + ' - ' + customer.phone);
  };

  useEffect(() => {
    if (spaceOfServices) {
      setLoadedSpaceOfServices(spaceOfServices);
    }
  }, [spaceOfServices]);

  useEffect(() => {
    if (services) {
      setLoadedServices(services);
    }
  }, [services]);
  return (
    <>
      <Label htmlFor='service'>Serviço</Label>
      <Controller
        control={form.control}
        name='service'
        render={({ field }) => (
          <Select value={field.value} onValueChange={field.onChange}>
            <SelectTrigger className='w-full'>
              <SelectValue placeholder='Selecione um serviço' />
            </SelectTrigger>
            <SelectContent>
              {loadedServices
                ? loadedServices.map((service) => (
                    <SelectItem key={service.id} value={service.id}>
                      {service.name}
                    </SelectItem>
                  ))
                : null}
            </SelectContent>
          </Select>
        )}
      />
      <Label htmlFor='spaceOfService'>Espaço de serviço</Label>
      <Controller
        control={form.control}
        name='spaceOfService'
        render={({ field }) => (
          <Select value={field.value} onValueChange={field.onChange}>
            <SelectTrigger className='w-full'>
              <SelectValue placeholder='Selecione um espaço' />
            </SelectTrigger>
            <SelectContent>
              {loadedSpaceOfServices
                ? loadedSpaceOfServices.map((space) => (
                    <SelectItem key={space.id} value={space.id}>
                      {space.name}
                    </SelectItem>
                  ))
                : null}
            </SelectContent>
          </Select>
        )}
      />
      <Label htmlFor='customer'>Cliente</Label>
      <div className='flex gap-2'>
        <Controller
          control={form.control}
          name='customerLabel'
          render={({ field }) => (
            <Input
              type='text'
              id='customerLabel'
              value={field.value}
              onChange={field.onChange}
              className='flex-1'
              disabled
            />
          )}
        />
        <Dialog>
          <DialogTrigger asChild>
            <Button variant='outline' type='button'>
              <Contact />
            </Button>
          </DialogTrigger>
          <SelectContact onSelect={onSelectCustomer} />
        </Dialog>
      </div>
      <Label htmlFor='notes'>Observações</Label>
      <Controller
        control={form.control}
        name='description'
        render={({ field }) => (
          <Textarea
            id='notes'
            value={field.value}
            onChange={field.onChange}
            className='w-full'
          />
        )}
      />
    </>
  );
}

function StepTwo({ form, available, setAvailable }: StepProps) {
  const [date, setDate] = useState<Date | undefined>(undefined);

  useEffect(() => {
    if (date) {
      form.setValue('date', date);
    }
  }, [date, form]);

  return (
    <>
      <Label htmlFor='date' className='text-center block'>
        Data e horário
      </Label>
      <div className='max-h-[100%]'>
        <ScheduleCalendar
          date={date}
          setDate={setDate}
          available={available!}
          setAvailable={setAvailable!}
        />
      </div>
    </>
  );
}

function StepThree({ form }: StepProps) {
  const dateObj = form.getValues('date') ? form.getValues('date') : null;
  const formattedDate = dateObj
    ? format(dateObj, 'dd/MM/yyyy', { locale: ptBR })
    : '';
  const formattedTime = dateObj
    ? format(dateObj, 'HH:mm', { locale: ptBR })
    : '';

  const organizationId = useOrganizationId();

  const { data: spaceOfServices } = useGetSpaceOfServices(organizationId);
  const { data: services } = useGetServices(organizationId);

  const selectedService = services?.find(
    (service) => service.id === form.getValues('service')
  );
  const selectedSpaceOfService = spaceOfServices?.find(
    (space) => space.id === form.getValues('spaceOfService')
  );
  return (
    <>
      <Label htmlFor='description'>Resumo</Label>
      <Label> Servico: {selectedService?.name}</Label>
      <Label> Espaço de Serviço: {selectedSpaceOfService?.name}</Label>
      <Label> Cliente: {form.getValues('customerLabel')}</Label>
      <Label> Data: {formattedDate}</Label>
      <Label> Horário: {formattedTime}</Label>
      <Label> Observações: {form.getValues('description')}</Label>
    </>
  );
}
