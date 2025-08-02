import { Calendar1 } from 'lucide-react';

export default function MenuTitle() {
  return (
    <a href='#' className='flex flex-row items-center gap-2'>
      <Calendar1 size={25} color='var(--primary)' />
      <h3 className='font-bold'>Smart Agenda</h3>
    </a>
  );
}
