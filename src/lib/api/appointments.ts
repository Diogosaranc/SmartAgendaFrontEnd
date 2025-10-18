import { api } from '../axios';

export enum AppointmentStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELED = 'CANCELED',
  PAID = 'PAID',
  FINISHED = 'FINISHED',
}

export interface Appointment {
  id: string;
  date: Date;
  description: string;
  status: AppointmentStatus;
  createdAt: Date;
  updatedAt: Date | null;
  canceledAt: Date | null;
  finishedAt: Date | null;
  organizationId: string;
  serviceId: string;
  spaceOfServiceId: string;
  customerPhone: string;
}

export interface CreateAppointmentData {
  date: Date;
  description?: string;
  serviceId: string;
  spaceOfServiceId: string;
  customerPhone: string;
}

export interface UpdateAppointmentData {
  description?: string;
  organizationId?: string;
  serviceId?: string;
  spaceOfServiceId?: string;
  customerId?: string;
}

export interface RescheduleAppointmentsData {
  id: string;
  date: Date;
  organizationId: string;
}

export interface changeStatusAppointmentData {
  id: string;
  organizationId: string;
}

// Get all appointments
export async function getAppointments(
  organizationId: string
): Promise<Appointment[]> {
  try {
    const response = await api.get(
      `/organizations/${organizationId}/appointments`
    );
    // Extract the appointments array from the response

    return response.data as Appointment[];
  } catch (error) {
    throw new Error(`Failed to fetch appointments: ${error}`);
  }
}

export async function getAppointmentById(
  organizationId: string,
  id: string
): Promise<Appointment> {
  try {
    const response = await api.get(
      `/organizations/${organizationId}/appointments/id/${id}`
    );
    // Extract the appointments array from the response

    return response.data as Appointment;
  } catch (error) {
    throw new Error(`Failed to fetch appointments: ${error}`);
  }
}

// Create new appointment
export async function createAppointment(
  data: CreateAppointmentData,
  organizationId: string
): Promise<Appointment> {
  try {
    const response = await api.post(
      `/organizations/${organizationId}/appointments`,
      data
    );
    return response.data as Appointment;
  } catch (error) {
    throw new Error(`Failed to create appointment: ${error}`);
  }
}

// Update appointment
export async function updateAppointment(
  id: string,
  organizationId: string,
  data: UpdateAppointmentData
): Promise<Appointment> {
  try {
    const response = await api.put(
      `/organizations/${organizationId}/appointments`,
      data
    );
    return response.data as Appointment;
  } catch (error) {
    throw new Error(`Failed to update appointment: ${error}`);
  }
}

export async function cancelAppointment(
  data: changeStatusAppointmentData
): Promise<Appointment> {
  const { organizationId, id } = data;
  try {
    const response = await api.patch(
      `/organizations/${organizationId}/appointments/${id}/cancel`
    );
    return response.data as Appointment;
  } catch (error) {
    throw new Error(`Failed to cancel appointment: ${error}`);
  }
}

export async function completeAppointment(
  data: changeStatusAppointmentData
): Promise<Appointment> {
  const { organizationId, id } = data;
  try {
    const response = await api.patch(
      `/organizations/${organizationId}/appointments/${id}/complete`
    );
    return response.data as Appointment;
  } catch (error) {
    throw new Error(`Failed to complete appointment: ${error}`);
  }
}

export async function deleteAppointment(
  data: changeStatusAppointmentData
): Promise<void> {
  const { organizationId, id } = data;
  try {
    await api.patch(
      `/organizations/${organizationId}/appointments/${id}/delete`
    );
  } catch (error) {
    throw new Error(`Failed to delete appointment: ${error}`);
  }
}

export async function rescheduleAppointment(
  data: RescheduleAppointmentsData
): Promise<Appointment> {
  const { organizationId, id, date } = data;
  try {
    const response = await api.patch(
      `/organizations/${organizationId}/appointments/${id}/reschedule`,
      { date }
    );
    return response.data as Appointment;
  } catch (error) {
    throw new Error(`Failed to reschedule appointment: ${error}`);
  }
}

export async function getAppointmentsByDateRangeAndOrganizationId(
  organizationId: string,
  startDate: Date,
  endDate: Date
): Promise<Appointment[]> {
  try {
    const response = await api.get(
      `/organizations/${organizationId}/appointments/list/by-date-range`,
      {
        params: {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        },
      }
    );
    return response.data.appointments as Appointment[];
  } catch (error) {
    throw new Error(`Failed to fetch appointments: ${error}`);
  }
}

export async function getAppointmentsByMonthYearAndOrganizationId(
  organizationId: string,
  month: number,
  year: number
): Promise<Appointment[]> {
  try {
    const response = await api.get(
      `/organizations/${organizationId}/appointments/by-month`,
      {
        params: {
          month,
          year,
        },
      }
    );
    return response.data as Appointment[];
  } catch (error) {
    throw new Error(`Failed to fetch appointments: ${error}`);
  }
}
