import {
  createService,
  getServiceById,
  getServices,
  updateService,
  UpdateServiceData,
} from '@/lib/api/services';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export function useCreateService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service'] });
    },
  });
}

export function useGetServices(organizationId: string) {
  return useQuery({
    queryKey: ['service', organizationId],
    queryFn: () => getServices(organizationId!),
    enabled: !!organizationId,
    staleTime: Infinity,
  });
}

export function useGetServiceById() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      organizationId,
      id,
    }: {
      organizationId: string;
      id: string;
    }) => getServiceById(organizationId, id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['service', id] });
    },
  });
}

export function useGetServiceByName() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      organizationId,
      name,
    }: {
      organizationId: string;
      name: string;
    }) => getServiceById(organizationId, name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service', name] });
    },
  });
}

export function useUpdateService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      organizationId,
      id,
      data,
    }: {
      organizationId: string;
      id: string;
      data: UpdateServiceData;
    }) => updateService(organizationId, id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['service', id] });
    },
  });
}
