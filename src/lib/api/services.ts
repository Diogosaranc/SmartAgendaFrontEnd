import { api } from '../axios';

export interface Service {
  organizationId?: string;
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  image?: string | null;
  observations: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateServiceData {
  organizationId: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  image?: string | null;
  observations: string | null;
}

export interface UpdateServiceData {
  name?: string;
  description?: string;
  price?: number;
  duration?: number;
  image?: string | null;
  observations?: string | null;
}

// Create new service
export async function createService(data: CreateServiceData): Promise<Service> {
  try {
    const response = await api.post(
      `organizations/${data.organizationId}/services`,
      data
    );
    return response.data as Service;
  } catch (error) {
    throw error;
  }
}
// Get all services
export async function getServices(organizationId: string): Promise<Service[]> {
  try {
    const response = await api.get(`organizations/${organizationId}/services`);
    // Extract the Service array from the response
    const data = response.data as { services: Service[] };

    return data.services || [];
  } catch (error) {
    throw new Error(`Failed to fetch services: ${error}`);
  }
}

export async function getServiceById(
  organizationId: string,
  id: string
): Promise<Service> {
  try {
    const response = await api.get(
      `organizations/${organizationId}/services/id/${id}`
    );
    return response.data as Service;
  } catch (error) {
    throw new Error(`Failed to fetch service by id: ${error}`);
  }
}

export async function getServiceByName(
  organizationId: string,
  name: string
): Promise<Service> {
  try {
    const response = await api.get(
      `organizations/${organizationId}/services/name/${name}`
    );
    return response.data as Service;
  } catch (error) {
    throw new Error(`Failed to fetch service by id: ${error}`);
  }
}

// Update service
export async function updateService(
  organizationId: string,
  id: string,
  data: UpdateServiceData
): Promise<Service> {
  try {
    const response = await api.patch(
      `organizations/${organizationId}/services/id/${id}`,
      data
    );
    return response.data as Service;
  } catch (error) {
    throw new Error(`Failed to update service: ${error}`);
  }
}
