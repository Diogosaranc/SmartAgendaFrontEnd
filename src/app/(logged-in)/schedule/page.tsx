'use client';

import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';

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
import { MultiStep } from '@/components/ui/MultiStep';
import ScheduleCalendar from '@/components/ui/ScheduleCalendar';

export default function SchedulePage() {
  const [available, setAvailable] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);

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
    <Card className='max-w-xl mx-auto mt-0'>
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
            available={available}
            setAvailable={setAvailable}
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
              onClick={() => {
                setCurrentStep(currentStep + 1);
              }}
              disabled={currentStep === 2 && available}
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
  available?: boolean;
  setAvailable?: (available: boolean) => void;
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

function StepTwo({
  formData,
  setFormData,
  available,
  setAvailable,
}: StepProps) {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState<string>('');

  useEffect(() => {
    if (date && time) {
      const updatedData = formData;
      updatedData.date = date.toISOString();
      updatedData.time = time;
      setFormData(updatedData);
    }
  }, [date, time, formData, setFormData]);

  return (
    <>
      <Label htmlFor='date' className='text-center block'>
        Data e horário
      </Label>
      <div className='max-h-[100%]'>
        <ScheduleCalendar
          date={date}
          setDate={setDate}
          time={time}
          setTime={setTime}
          available={available!}
          setAvailable={setAvailable!}
        />
      </div>
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
