'use client';

import React, { useState, useEffect, useRef } from 'react';

import { Calendar } from '@/components/ui/calendar';

import { ptBR } from 'react-day-picker/locale';
import { Card, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

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

interface ScheduleCalendarProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  time: string;
  setTime: (time: string) => void;
  available: boolean;
  setAvailable: (available: boolean) => void;
}

export default function ScheduleCalendar({
  date,
  setDate,
  time,
  setTime,
  setAvailable,
}: ScheduleCalendarProps) {
  const [hasSelectedDate, setHasSelectedDate] = useState(false);
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
    setAvailable(isAvailable());
  };

  const isAvailable = (): boolean => {
    const timeAvailable = schedules.find((schedule) => schedule.time === time);
    return timeAvailable ? timeAvailable.available : false;
  };

  return (
    <div
      className={`lg:grid grid-cols-4 gap-2 w-full max-w-full mx-auto max-h-[calc(100vh-8rem)] sm:max-h-full sm:mb-5`}
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
        <p className='text-xs text-muted-foreground text-center'>
          Selecione um horário
        </p>
        <div className='grid gap-1 mt-0 mb-0 text-xs'>
          <div className='flex items-center gap-1'>
            <span className='w-3 h-3 bg-primary rounded'></span>
            <span>Disponível</span>
          </div>
          <div className='flex items-center gap-2'>
            <span className='w-3 h-3 bg-primary/50 rounded'></span>
            <span>Ocupado</span>
          </div>
        </div>
        <div className='grid relative text-center gap-1 mt-0 overflow-y-auto max-h-[calc(65vh-20rem)] w-[70%]'>
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
          (!!time ? '' : ' hidden')
        }
      >
        <h2 className='text-sm text-center font-semibold'>{formattedDate}</h2>
        <p className='text-xs text-center text-muted-foreground'>
          Você selecionou o horário: <strong>{time}</strong>
        </p>
        <AgendaItem available={isAvailable()} client='Diogo' />
      </Card>
    </div>
  );
}

interface AgendaItemProps {
  available: boolean;
  client: string;
}

export function AgendaItem({ available, client }: AgendaItemProps) {
  const agendaAvailable = (
    <>
      <CardTitle className='text-md text-center'>Disponível</CardTitle>
    </>
  );

  const agendaUnavailable = (
    <>
      <CardTitle className='text-md text-center'>
        Indisponível - {client}
      </CardTitle>
    </>
  );
  return (
    <Card className='flex items-center w-[90%]'>
      {available ? agendaAvailable : agendaUnavailable}
    </Card>
  );
}

interface ScheduleItemProps {
  time: string;
  available: boolean;
  onClick: () => void;
}

export function ScheduleItem({ time, available, onClick }: ScheduleItemProps) {
  return (
    <Button
      className={
        'p-2 text-xm last:mb-1 ' + (available ? 'bg-primary' : 'bg-primary/50')
      }
      size='xs'
      onClick={onClick}
    >
      {time}
    </Button>
  );
}
