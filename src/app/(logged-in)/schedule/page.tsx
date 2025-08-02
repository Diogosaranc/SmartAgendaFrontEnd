'use client';

import { useState } from 'react';

import { ptBR } from 'react-day-picker/locale';
import { CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { MultiStep } from '@/components/ui/MultiStep';

export default function SchedulePage() {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [currentStep, setCurrentStep] = useState(1);

  // Form state
  const [formData, setFormData] = useState({
    service: '',
    spaceOfService: '',
    client: '',
    date: '',
    time: '',
    notes: '',
  });

  const steps = 3;

  return (
    <Card className='max-w-lg mx-auto mt-10'>
      <CardHeader className='text-center'>
        <h1 className='text-2xl font-bold'>Agendamento</h1>
      </CardHeader>
      <CardContent className='space-y-4'>
        <MultiStep size={steps} currentStep={currentStep} />
        <Separator className='my-4' />
        {currentStep === 1 && (
          <StepOne formData={formData} setFormData={setFormData} />
        )}
        {currentStep === 2 && (
          <StepTwo
            formData={formData}
            setFormData={setFormData}
            date={date}
            setDate={setDate}
          />
        )}
        {currentStep === 3 && (
          <StepThree formData={formData} setFormData={setFormData} />
        )}

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
              onClick={() => setCurrentStep(currentStep + 1)}
            >
              Próximo
            </Button>
          ) : (
            <Button className='flex-1' variant='default'>
              Agendar
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

interface StepProps {
  formData: {
    service: string;
    spaceOfService: string;
    client: string;
    date: string;
    time: string;
    notes: string;
  };
  setFormData: (data: StepProps['formData']) => void;
}

function StepOne({ formData, setFormData }: StepProps) {
  return (
    <>
      <Label htmlFor='service'>Serviço</Label>
      <Select
        value={formData.service}
        onValueChange={(value) => setFormData({ ...formData, service: value })}
      >
        <SelectTrigger className='w-full'>
          <SelectValue placeholder='Selecione um serviço' />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='service1'>Serviço 1</SelectItem>
          <SelectItem value='service2'>Serviço 2</SelectItem>
          <SelectItem value='service3'>Serviço 3</SelectItem>
        </SelectContent>
      </Select>
      <Label htmlFor='spaceOfService'>Espaço de serviço</Label>
      <Select
        value={formData.spaceOfService}
        onValueChange={(value) =>
          setFormData({ ...formData, spaceOfService: value })
        }
      >
        <SelectTrigger className='w-full'>
          <SelectValue placeholder='Selecione um espaço' />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='space1'>Espaço serviço 1</SelectItem>
          <SelectItem value='space2'>Espaço serviço 2</SelectItem>
          <SelectItem value='space3'>Espaço serviço 3</SelectItem>
        </SelectContent>
      </Select>
      <Label htmlFor='client'>Cliente</Label>
      <Input
        type='text'
        id='client'
        value={formData.client}
        onChange={(e) => setFormData({ ...formData, client: e.target.value })}
        placeholder='Nome do cliente'
        className='w-full'
      />
      <Label htmlFor='notes'>Observações</Label>
      <Textarea
        id='notes'
        value={formData.notes}
        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
        className='w-full'
      />
    </>
  );
}

interface StepTwoProps extends StepProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
}

function StepTwo({ formData, setFormData, date, setDate }: StepTwoProps) {
  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    if (selectedDate) {
      const formattedDate = selectedDate.toLocaleDateString('pt-BR');
      setFormData({ ...formData, date: formattedDate });
    }
  };

  return (
    <>
      <Label htmlFor='date'>Data</Label>
      <div className='relative'>
        <Input
          type='text'
          id='date'
          name='date'
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          placeholder='DD/MM/YYYY'
          pattern='^(0[1-9]|[12][0-9]|3[01])/(0[1-9]|1[0-2])/\d{4}$'
          maxLength={10}
          required
        />
        <Popover>
          <PopoverTrigger asChild>
            <CalendarIcon className='absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 cursor-pointer' />
          </PopoverTrigger>
          <PopoverContent>
            <Calendar
              mode='single'
              selected={date}
              onSelect={handleDateSelect}
              locale={ptBR}
              className='rounded-md'
            />
          </PopoverContent>
        </Popover>
      </div>
      <Label htmlFor='time'>Horário</Label>
      <Input
        type='time'
        id='time'
        value={formData.time}
        onChange={(e) => setFormData({ ...formData, time: e.target.value })}
        className='w-full'
      />
    </>
  );
}

interface StepThreeProps extends StepProps {
  formData: {
    service: string;
    spaceOfService: string;
    client: string;
    date: string;
    time: string;
    notes: string;
  };
}

function StepThree({ formData }: StepThreeProps) {
  return (
    <>
      <Label htmlFor='description'>Resumo</Label>
      <Label> Servico: {formData.service}</Label>
      <Label> Espaço de Serviço: {formData.spaceOfService}</Label>
      <Label> Cliente: {formData.client}</Label>
      <Label> Data: {formData.date}</Label>
      <Label> Horário: {formData.time}</Label>
      <Label> Observações: {formData.notes}</Label>
    </>
  );
}
