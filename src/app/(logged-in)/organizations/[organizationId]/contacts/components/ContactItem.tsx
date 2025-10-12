import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import ManageContactDialog, {
  ContactDialogState,
} from '@/components/ui/ManageContactDialog';
import { Dialog, DialogTrigger } from '@radix-ui/react-dialog';
import { BookUser, User } from 'lucide-react';

interface ContactItemProps {
  customer: {
    id: string;
    name: string;
    phone: string;
  };
  onUpdateSuccess?: () => void;
}

export default function ContactItem({
  customer,
  onUpdateSuccess,
}: ContactItemProps) {
  return (
    <Card className='w-4/5 h-[8vh] p-4 flex flex-row items-center justify-between'>
      <div className='flex flex-row gap-4 items-center'>
        <User />
        <div>
          <h5 className='text-m'>{customer.name}</h5>
          <p className='text-muted-foreground text-sm'>{customer.phone}</p>
        </div>
      </div>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant='outline' size='sm'>
            <BookUser />
          </Button>
        </DialogTrigger>
        <ManageContactDialog
          state={ContactDialogState.VIEW}
          customer={customer}
          onSuccess={onUpdateSuccess}
        />
      </Dialog>
    </Card>
  );
}
