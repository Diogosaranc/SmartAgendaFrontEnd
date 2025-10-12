'use client';

import { Card, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { SidebarSeparator } from '@/components/ui/sidebar';
import { Contact } from 'lucide-react';
import ContactItem from './components/ContactItem';
import { Button } from '@/components/ui/button';
import { Dialog } from '@radix-ui/react-dialog';
import { DialogTrigger } from '@/components/ui/dialog';
import ManageContactDialog, {
  ContactDialogState,
} from '@/components/ui/ManageContactDialog';
import { useOrganizationId } from '@/hooks/use-organization-id';
import { useGetCustomers, useGetCustomersByName } from '@/hooks/use-customers';
import { useEffect, useState } from 'react';
import { Customer } from '@/lib/api/customers';

export default function ContactsPage() {
  const organizationId = useOrganizationId();

  const [searchTerm, setSearchTerm] = useState('');

  const { data: customers = [], refetch } = useGetCustomers(organizationId);

  // Use mutation for search
  const {
    data: searchResults,
    mutate: searchCustomers,
    isPending: isSearching,
  } = useGetCustomersByName();

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
    <Card className='h-[90vh] w-3xl flex flex-col mx-auto'>
      <CardHeader>
        <h2 className='text-lg font-bold flex items-center gap-2 justify-center'>
          Contatos <Contact />
        </h2>
      </CardHeader>
      <Input
        placeholder='Pesquisar contatos...'
        className='mb-4 h-8 w-xl mx-auto'
        value={searchTerm}
        onChange={handleSearchChange}
      />
      <SidebarSeparator className='mx-0 w-full' />
      <Card className='w-4/5 h-3/5 flex-1 flex flex-col gap-4 p-4 min-h-0 justify-center mx-auto'>
        <div className='overflow-y-auto h-full w-full flex flex-col items-center gap-4'>
          {isSearching ? (
            <div className='flex items-center justify-center p-4'>
              <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900'></div>
              <span className='ml-2'>Pesquisando...</span>
            </div>
          ) : displayedCustomers && displayedCustomers.length > 0 ? (
            displayedCustomers.map((contact: Customer) => (
              <ContactItem
                key={contact.id}
                customer={contact}
                onUpdateSuccess={handleUpdateSuccess}
              />
            ))
          ) : (
            <p className='text-muted-foreground'>
              {isShowingSearchResults
                ? `Nenhum contato encontrado para "${searchTerm}"`
                : 'Nenhum contato encontrado.'}
            </p>
          )}
        </div>
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
      </Card>
    </Card>
  );
}
