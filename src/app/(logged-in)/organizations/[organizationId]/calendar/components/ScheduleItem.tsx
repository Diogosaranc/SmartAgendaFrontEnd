import { Button } from '@/components/ui/button';

interface ScheduleItemProps {
  time: string;
  available: boolean;
  onClick: () => void;
}

export default function ScheduleItem({
  time,
  available,
  onClick,
}: ScheduleItemProps) {
  return (
    <Button
      className={
        'p-2 text-sm last:mb-1 ' + (available ? 'bg-primary' : 'bg-primary/50')
      }
      onClick={onClick}
    >
      {time}
    </Button>
  );
}
