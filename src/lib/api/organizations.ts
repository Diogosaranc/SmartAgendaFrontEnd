import { api } from "../axios";
import { mapOrganizationToDTO, OrganizationDTO } from "./mapper/mappers";

export interface Organization {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string | null;
  members: unknown[];
  ownerId: string;
}

export interface CreateOrganizationData {
  name: string;
  // description: string;
}

export interface UpdateOrganizationData {
  name?: string;
  // description?: string;
}

// Get all organizations
export async function getOrganizations(): Promise<Organization[]> {
  try {
    const response = await api.get('/organizations');
    // Extract the organizations array from the response
    const data = response.data as { organizations: OrganizationDTO[] };

    return data.organizations.map(mapOrganizationToDTO) || [];
  } catch (error) {
    throw new Error(`Failed to fetch organizations: ${error}`);
  }
}

// Create new organization
export async function createOrganization(data: CreateOrganizationData): Promise<Organization> {
  try {
    const response = await api.post('/organizations', data);
    return response.data as Organization;
  } catch (error) {
    throw new Error(`Failed to create organization: ${error}`);
  }
}

// Update organization
export async function updateOrganization(id: string, data: UpdateOrganizationData): Promise<Organization> {
  try {
    const response = await api.put(`/organizations/${id}`, data);
    return response.data as Organization;
  } catch (error) {
    throw new Error(`Failed to update organization: ${error}`);
  }
}

// Delete organization
// export async function deleteOrganization(id: string): Promise<void> {
//   try {
//     await api.delete(`/organizations/${id}`);
//   } catch (error) {
//     throw new Error(`Failed to delete organization: ${error}`);
//   }
// }
