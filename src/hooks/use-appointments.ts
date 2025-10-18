import {
  createAppointment,
  CreateAppointmentData,
  deleteAppointment,
  getAppointmentById,
  getAppointments,
  getAppointmentsByDateRangeAndOrganizationId,
  getAppointmentsByMonthYearAndOrganizationId,
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

export function useGetAppointmentsByDateRange() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      organizationId,
      startDate,
      endDate,
    }: {
      organizationId: string;
      startDate: Date;
      endDate: Date;
    }) =>
      getAppointmentsByDateRangeAndOrganizationId(
        organizationId,
        startDate,
        endDate
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointment'] });
    },
  });
}

export function useGetAppointmentByMonth() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      organizationId,
      month,
      year,
    }: {
      organizationId: string;
      month: number;
      year: number;
    }) =>
      getAppointmentsByMonthYearAndOrganizationId(organizationId, month, year),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointment'] });
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
