import { api } from '../axios';

export interface SpaceOfService {
  id: string;
  organizationId?: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt?: string | null;
}

export interface CreateSpaceOfServiceData {
  organizationId: string;
  name: string;
  description: string;
}

export interface UpdateSpaceOfServiceData {
  name?: string;
  description?: string;
}

// Create new spaceofservice
export async function createSpaceOfService(
  data: CreateSpaceOfServiceData
): Promise<SpaceOfService> {
  try {
    const response = await api.post(
      `organizations/${data.organizationId}/spaceofservices`,
      data
    );
    return response.data as SpaceOfService;
  } catch (error) {
    throw error;
  }
}
// Get all spaceofservices
export async function getSpaceOfServices(
  organizationId: string
): Promise<SpaceOfService[]> {
  try {
    const response = await api.get(
      `organizations/${organizationId}/spaceofservices/`
    );
    // Extract the spacesOfService array from the response
    const data = response.data as { spacesOfService: SpaceOfService[] };

    return data.spacesOfService || [];
  } catch (error) {
    throw new Error(`Failed to fetch spaceofservices: ${error}`);
  }
}

export async function getSpaceOfServiceById(
  organizationId: string,
  id: string
): Promise<SpaceOfService> {
  try {
    const response = await api.get(
      `organizations/${organizationId}/spaceofservices/id/${id}`
    );
    return response.data as SpaceOfService;
  } catch (error) {
    throw new Error(`Failed to fetch spaceofservice by id: ${error}`);
  }
}

export async function getSpaceOfServiceByName(
  organizationId: string,
  name: string
): Promise<SpaceOfService> {
  try {
    const response = await api.get(
      `organizations/${organizationId}/spaceofservices/name/${name}`
    );
    return response.data as SpaceOfService;
  } catch (error) {
    throw new Error(`Failed to fetch spaceofservice by id: ${error}`);
  }
}

// Update spaceofservice
export async function updateSpaceOfService(
  organizationId: string,
  id: string,
  data: UpdateSpaceOfServiceData
): Promise<SpaceOfService> {
  try {
    const response = await api.put(
      `organizations/${organizationId}/spaceofservices/${id}`,
      data
    );
    return response.data as SpaceOfService;
  } catch (error) {
    throw new Error(`Failed to update spaceofservice: ${error}`);
  }
}
