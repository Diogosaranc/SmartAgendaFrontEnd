import { Button } from '@/components/ui/button';
import { Card, CardContent, CardTitle } from '@/components/ui/card';

interface AgendaItemProps {
  available: boolean;
  client: string;
  onClick: () => void;
}

export default function AgendaItem({
  available,
  client,
  onClick,
}: AgendaItemProps) {
  const agendaAvailable = (
    <>
      <CardTitle className='text-md text-center'>Disponível</CardTitle>
      <CardContent className='flex items-center justify-center gap-2 mt-2 w-full'>
        <Button
          variant='default'
          size='sm'
          className='w-[90%]'
          onClick={onClick}
        >
          Agendar
        </Button>
      </CardContent>
    </>
  );

  const agendaUnavailable = (
    <>
      <CardTitle className='text-md text-center'>
        Indisponível - {client}
      </CardTitle>
      <CardContent className='flex items-center justify-center gap-2 mt-2 w-full'>
        <Button
          variant='outline'
          size='sm'
          className='w-[45%]'
          onClick={onClick}
        >
          Cancelar
        </Button>
        <Button
          variant='default'
          size='sm'
          className='w-[45%]'
          onClick={onClick}
        >
          Confirmar
        </Button>
      </CardContent>
    </>
  );
  return (
    <Card className='flex items-center w-[90%]'>
      {available ? agendaAvailable : agendaUnavailable}
    </Card>
  );
}
