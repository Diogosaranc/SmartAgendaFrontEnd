import { api } from '../axios';
import { mapUserToDTO, UserDTO } from './mapper/mappers';

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string | null;
}

// export interface UpdateUserData {
//   name?: string;
// }

// Get user info
export async function getUsers(): Promise<User> {
  try {
    const response = await api.get('/users');
    // Extract the users array from the response
    const data = response.data as { user: UserDTO };

    return mapUserToDTO(data.user);
  } catch (error) {
    throw new Error(`Failed to fetch users: ${error}`);
  }
}
