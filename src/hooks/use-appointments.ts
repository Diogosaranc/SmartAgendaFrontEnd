import {
  createAppointment,
  CreateAppointmentData,
  deleteAppointment,
  getAppointmentById,
  getAppointments,
  updateAppointment,
  UpdateAppointmentData,
} from '@/lib/api/appointments';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export function useCreateAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      data,
      organizationId,
    }: {
      data: CreateAppointmentData;
      organizationId: string;
    }) => createAppointment(data, organizationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointment'] });
    },
  });
}

export function useGetAppointments(organizationId: string) {
  return useQuery({
    queryKey: ['appointment', organizationId],
    queryFn: () => getAppointments(organizationId),
    enabled: !!organizationId,
    staleTime: Infinity,
  });
}

export function useGetAppointmentById() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      organizationId,
      id,
    }: {
      organizationId: string;
      id: string;
    }) => getAppointmentById(organizationId, id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['appointment', id] });
    },
  });
}

export function useGetAppointmentByName() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      organizationId,
      name,
    }: {
      organizationId: string;
      name: string;
    }) => getAppointmentById(organizationId, name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointment', name] });
    },
  });
}

export function useUpdateAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      organizationId,
      id,
      data,
    }: {
      organizationId: string;
      id: string;
      data: UpdateAppointmentData;
    }) => updateAppointment(organizationId, id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['appointment', id] });
    },
  });
}

export function useDeleteAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      organizationId,
      id,
    }: {
      organizationId: string;
      id: string;
    }) => deleteAppointment({ organizationId, id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointment'] });
    },
  });
}
