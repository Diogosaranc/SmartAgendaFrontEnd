'use client';

import * as React from 'react';

import { Calendar } from '@/components/ui/calendar';

import { ptBR } from 'react-day-picker/locale';
import { Card } from '@/components/ui/card';
import ScheduleItem from './components/ScheduleItem';
import { useState } from 'react';
import AgendaItem from './components/AgendaItem';

const schedules = [
  { time: '08:00', available: true },
  { time: '08:30', available: false },
  { time: '09:00', available: true },
  { time: '09:30', available: false },
  { time: '10:00', available: true },
  { time: '10:30', available: false },
  { time: '11:00', available: true },
  { time: '11:30', available: false },
  { time: '12:00', available: true },
  { time: '12:30', available: false },
  { time: '13:00', available: true },
  { time: '13:30', available: false },
  { time: '14:00', available: true },
  { time: '14:30', available: false },
  { time: '15:00', available: true },
  { time: '15:30', available: false },
  { time: '16:00', available: true },
  { time: '16:30', available: false },
  { time: '17:00', available: true },
  { time: '17:30', available: false },
];

export default function CalendarPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  const [hasSelectedDate, setHasSelectedDate] = useState(false);

  const [time, setTime] = useState<string | undefined>(undefined);

  const formattedDate = date?.toLocaleDateString('pt-BR', {
    weekday: 'short',
    year: 'numeric',
    month: '2-digit',
    day: 'numeric',
  });

  const onSelectDate = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    setHasSelectedDate(!!selectedDate);
  };

  const onSelectTime = (time: string) => {
    setTime(time);
  };

  const isAvailable = (): boolean => {
    const timeAvailable = schedules.find((schedule) => schedule.time === time);

    return timeAvailable ? timeAvailable.available : false;
  };

  return (
    <div className='lg:grid grid-cols-4 gap-6 w-full max-w-7xl mx-auto h-[calc(70vh-64px)] sm:mb-5'>
      <Calendar
        mode='single'
        defaultMonth={date}
        selected={date}
        onSelect={onSelectDate}
        captionLayout='dropdown'
        className='rounded-lg border shadow-sm col-span-2 w-full'
        locale={ptBR}
      />
      <Card
        className={
          'col-span-1 flex items-center flex-col mt-2 lg:mt-0' +
          (!hasSelectedDate ? ' hidden' : '')
        }
      >
        <p className='text-sm text-muted-foreground text-center'>
          Selecione um horário
        </p>
        <div className='flex gap-4 justify-center mt-2 mb-2 text-xs'>
          <div className='flex items-center gap-2'>
            <span className='w-3 h-3 bg-primary rounded'></span>
            <span>Disponível</span>
          </div>
          <div className='flex items-center gap-2'>
            <span className='w-3 h-3 bg-primary/50 rounded'></span>
            <span>Ocupado</span>
          </div>
        </div>
        <div className='grid relative text-center gap-2 mt-2 overflow-y-auto max-h-96 w-[70%]'>
          {schedules.map((schedule) => (
            <ScheduleItem
              key={schedule.time}
              time={schedule.time}
              available={schedule.available}
              onClick={() => onSelectTime(schedule.time)}
            />
          ))}
        </div>
      </Card>
      <Card
        className={
          'col-span-1 flex items-center flex-col mt-4 lg:mt-0' +
          (!time ? ' hidden' : '')
        }
      >
        <h2 className='text-lg font-semibold'>Agenda, {formattedDate}</h2>
        <p className='text-sm text-muted-foreground'>
          Você selecionou o horário: <strong>{time}</strong>
        </p>
        <AgendaItem
          available={isAvailable()}
          client='Diogo'
          onClick={() => alert('Agendamento realizado com sucesso!')}
        />
      </Card>
    </div>
  );
}
