import {
  createSpaceOfService,
  getSpaceOfServiceById,
  getSpaceOfServices,
  updateSpaceOfService,
  UpdateSpaceOfServiceData,
} from '@/lib/api/space-of-services';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export function useCreateSpaceOfService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createSpaceOfService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['space-of-service'] });
    },
  });
}

export function useGetSpaceOfServices(organizationId: string) {
  return useQuery({
    queryKey: ['space-of-service', organizationId],
    queryFn: () => getSpaceOfServices(organizationId!),
    enabled: !!organizationId,
    staleTime: Infinity,
  });
}

export function useGetSpaceOfServiceById() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      organizationId,
      id,
    }: {
      organizationId: string;
      id: string;
    }) => getSpaceOfServiceById(organizationId, id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['space-of-service', id] });
    },
  });
}

export function useGetSpaceOfServiceByName() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      organizationId,
      name,
    }: {
      organizationId: string;
      name: string;
    }) => getSpaceOfServiceById(organizationId, name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['space-of-service', name] });
    },
  });
}

export function useUpdateSpaceOfService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      organizationId,
      id,
      data,
    }: {
      organizationId: string;
      id: string;
      data: UpdateSpaceOfServiceData;
    }) => updateSpaceOfService(organizationId, id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['space-of-service', id] });
    },
  });
}
