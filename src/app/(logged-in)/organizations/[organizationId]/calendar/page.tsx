'use client';

import * as React from 'react';

import { Calendar } from '@/components/ui/calendar';

import { ptBR } from 'react-day-picker/locale';
import { Card } from '@/components/ui/card';
import ScheduleItem from './components/ScheduleItem';
import { useState, useEffect, useRef } from 'react';
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
  const cardRef = useRef<HTMLDivElement>(null);
  const agendaRef = useRef<HTMLDivElement>(null);

  // Auto-scroll on small screens when date is selected
  useEffect(() => {
    if (hasSelectedDate && cardRef.current && window.innerWidth < 1024) {
      setTimeout(() => {
        cardRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }, 100);
    }
  }, [hasSelectedDate]);

  // Auto-scroll on small screens when time is selected
  useEffect(() => {
    if (time && agendaRef.current && window.innerWidth < 1024) {
      setTimeout(() => {
        agendaRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }, 100);
    }
  }, [time]);

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
    <div
      className={`lg:grid grid-cols-4 gap-6 w-full max-w-[1280px] mx-auto max-h-[calc(100vh-8rem)] sm:mb-5`}
    >
      <div
        className={`sm:invisible ${
          !hasSelectedDate ? 'col-span-1 col-start-1' : 'invisible'
        }`}
      />
      <Calendar
        mode='single'
        defaultMonth={date}
        selected={date}
        onSelect={onSelectDate}
        captionLayout='dropdown'
        className={`rounded-lg border shadow-sm w-full p-4 overflow-hidden ${
          !hasSelectedDate
            ? 'col-span-2' // Center when no date
            : time
            ? 'col-span-2 col-start-1' // Left side when time selected
            : 'col-span-2 col-start-2' // Slightly right when date selected
        }`}
        locale={ptBR}
      />
      <Card
        ref={cardRef}
        className={`flex items-center flex-col mt-2 lg:mt-0 ${
          !hasSelectedDate
            ? 'hidden'
            : time
            ? 'col-span-1 col-start-3' // Position after calendar when time selected
            : 'col-span-1 col-start-4' // Position at end when just date selected
        }`}
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
        ref={agendaRef}
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
