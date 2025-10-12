import {
  createCustomer,
  getCustomerById,
  getCustomerByPhone,
  getCustomers,
  getCustomersByName,
  updateCustomer,
  UpdateCustomerData,
} from '@/lib/api/customers';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export function useCreateCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      organizationId: string;
      name: string;
      phone: string;
    }) => createCustomer(data),
    onSuccess: (_, { organizationId }) => {
      // Invalidate the customers list for this organization
      queryClient.invalidateQueries({ queryKey: ['Customer', organizationId] });
    },
    onError: (error) => {
      console.error('Error creating customer:', error);
    },
  });
}

export function useGetCustomers(organizationId: string) {
  return useQuery({
    queryKey: ['Customer', organizationId],
    queryFn: () => getCustomers(organizationId!),
    enabled: !!organizationId,
    staleTime: Infinity,
  });
}

export function useGetCustomerById() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      organizationId,
      id,
    }: {
      organizationId: string;
      id: string;
    }) => getCustomerById(organizationId, id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['Customer', id] });
    },
  });
}

export function useGetCustomersByName() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      organizationId,
      name,
    }: {
      organizationId: string;
      name: string;
    }) => getCustomersByName(organizationId, name),
    onSuccess: (data, { organizationId, name }) => {
      queryClient.setQueryData(
        ['Customer', organizationId, 'search', name],
        data
      );
    },
  });
}

export function useGetCustomerByPhone(organizationId: string, phone: string) {
  return useQuery({
    queryKey: ['Customer', organizationId, phone],
    queryFn: () => getCustomerByPhone(organizationId, phone),
    enabled: !!organizationId,
    staleTime: Infinity,
  });
}

export function useUpdateCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      organizationId,
      id,
      data,
    }: {
      organizationId: string;
      id: string;
      data: UpdateCustomerData;
    }) => updateCustomer(organizationId, id, data),
    onSuccess: (_, { organizationId, id }) => {
      // Invalidate the customers list for this organization
      queryClient.invalidateQueries({ queryKey: ['Customer', organizationId] });
      // Also invalidate the specific customer query if it exists
      queryClient.invalidateQueries({
        queryKey: ['Customer', organizationId, id],
      });
    },
  });
}
