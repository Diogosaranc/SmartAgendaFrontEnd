import { Button } from '@/components/ui/button';
import { Calendar1Icon } from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <>
      <h1 className='flex items-center gap-2 text-4xl font-bold'>
        <Calendar1Icon size={50} />
        Bem vindo a Smart Agenda
      </h1>
      <p>Uma agenda inteligente e intuitiva para organizar seu negócio</p>
      <div className='flex gap-2 items-center'>
        <Button asChild>
          <Link href='/log-in'>Entrar</Link>
        </Button>
        <small>ou</small>
        <Button variant={'outline'} asChild>
          <Link href='/sign-up'>Registrar</Link>
        </Button>
      </div>
    </>
  );
}
