'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export default function MyInbox() {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-full'>
      <Card className='col-span-full w-full'>
        <CardHeader>
          <CardTitle className='text-base flex items-center justify-center h-full'></CardTitle>
        </CardHeader>
      </Card>
      <Card className='w-full min-w-0'>
        <CardHeader>
          <CardTitle className='text-base flex items-center justify-center h-full'>
            Hoje
          </CardTitle>
        </CardHeader>
        <CardContent className='flex justify-between'>
          <div>
            Atendimentos: <br />
            <br />
            <span className='text-sm text-gray-500'>
              3 atendimentos agendados
            </span>
            <br />
            <span className='text-sm text-gray-500'>
              2 atendimentos confirmados
            </span>
          </div>
          <div>
            <Button size={'xs'} asChild>
              <Link href='/agenda'>Ver agenda</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
      <Card className='w-full min-w-0'>
        <CardHeader>
          <CardTitle className='text-base flex items-center justify-center h-full'>
            Amanhã
          </CardTitle>
        </CardHeader>
        <CardContent className='flex justify-between'>
          <div>
            Atendimentos: <br />
            <br />
            <span className='text-sm text-gray-500'>
              4 atendimentos agendados
            </span>
          </div>
          <div>
            <Button size={'xs'} asChild>
              <Link href='/agenda'>Ver agenda</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
      <Card className='border-primary w-full min-w-0'>
        <CardHeader>
          <CardTitle className='text-base flex items-center justify-center h-full'>
            Próximos 7 dias
          </CardTitle>
        </CardHeader>
        <CardContent className='flex justify-between'>
          <div>
            Atendimentos: <br />
            <br />
            <span className='text-sm text-gray-500'>
              8 atendimentos agendados
            </span>
          </div>
          <div>
            <Button size={'xs'} asChild>
              <Link href='/agenda'>Ver agenda</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
