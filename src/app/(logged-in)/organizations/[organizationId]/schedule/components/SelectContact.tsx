import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import ManageContactDialog, {
  ContactDialogState,
} from '@/components/ui/ManageContactDialog';
import { useGetCustomers, useGetCustomersByName } from '@/hooks/use-customers';
import { useOrganizationId } from '@/hooks/use-organization-id';
import { Customer } from '@/lib/api/customers';
import { useEffect, useState } from 'react';

export default function SelectContact({
  onSelect,
}: {
  onSelect: (customer: Customer) => void;
}) {
  const organizationId = useOrganizationId();

  const [searchTerm, setSearchTerm] = useState('');

  const { data: customers = [], refetch } = useGetCustomers(organizationId);

  const onSelectCustomer = (customer: Customer) => {
    onSelect(customer);
  };

  // Use mutation for search
  const { data: searchResults, mutate: searchCustomers } =
    useGetCustomersByName();

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm.trim() && searchTerm.length >= 2) {
        searchCustomers({
          organizationId: organizationId,
          name: searchTerm.trim(),
        });
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(timeoutId);
  }, [searchTerm, organizationId, searchCustomers]);

  // Determine which customers to display
  const displayedCustomers =
    searchTerm.trim().length >= 2 ? searchResults : customers;
  const isShowingSearchResults = searchTerm.trim().length >= 2;

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleUpdateSuccess = () => {
    refetch();
    // If we're showing search results, re-run the search
    if (isShowingSearchResults) {
      searchCustomers({
        organizationId: organizationId,
        name: searchTerm.trim(),
      });
    }
  };

  return (
    <DialogContent className='sm:max-w-[425px]'>
      <DialogHeader>
        <DialogTitle>Selecionar Cliente</DialogTitle>
        <DialogDescription>
          Pesquise e selecione um cliente para o agendamento.
        </DialogDescription>
      </DialogHeader>
      <div className='grid gap-4'>
        <div className='grid gap-3'>
          <Label htmlFor='search'>Pesquisar cliente</Label>
          <Input
            id='search'
            name='search'
            placeholder='Digite o nome'
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        {/* TODO: Add customer list here */}
        <div className='grid gap-2 max-h-60 overflow-y-auto'>
          {displayedCustomers && displayedCustomers.length > 0 ? (
            displayedCustomers.map((customer) => (
              <DialogClose asChild key={customer.id}>
                <div
                  className='p-2 border rounded hover:opacity-50 cursor-pointer'
                  onClick={() => onSelectCustomer(customer)}
                >
                  <div className='font-medium'>{customer.name}</div>
                  <div className='text-sm text-gray-500'>{customer.phone}</div>
                </div>
              </DialogClose>
            ))
          ) : (
            <div className='p-2 text-gray-500'>Nenhum cliente encontrado</div>
          )}
        </div>
      </div>
      <DialogFooter>
        <DialogClose asChild>
          <Button variant='outline'>Cancelar</Button>
        </DialogClose>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Adicionar Novo Contato</Button>
          </DialogTrigger>
          <ManageContactDialog
            state={ContactDialogState.CREATE}
            customer={{ id: '', name: '', phone: '' }}
            onSuccess={handleUpdateSuccess}
          />
        </Dialog>
      </DialogFooter>
    </DialogContent>
  );
}
