'use client';

import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useParams } from 'next/navigation';

export default function AppointmentDetailsPage() {
  const params = useParams();
  const appointmentId = params.appointmentId as string;
  const organizationId = params.organizationId as string;

  return (
    <Card className='max-w-2xl mx-auto'>
      <CardHeader>
        <h1 className='text-2xl font-bold'>Detalhes do Agendamento</h1>
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          <div>
            <label className='text-sm font-medium text-muted-foreground'>
              ID do Agendamento
            </label>
            <p className='text-lg'>{appointmentId}</p>
          </div>
          <Separator />
          <div>
            <label className='text-sm font-medium text-muted-foreground'>
              Organização
            </label>
            <p className='text-lg'>{organizationId}</p>
          </div>
          <div className='mt-6'>
            <p className='text-muted-foreground'>
              Carregando detalhes do agendamento...
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
