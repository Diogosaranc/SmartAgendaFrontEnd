import { api } from '../axios';

export interface Customer {
  organizationId: string;
  id: string;
  name: string;
  phone: string;
}

export interface CreateCustomerData {
  organizationId: string;
  name: string;
  phone: string;
}

export interface UpdateCustomerData {
  name?: string;
  phone?: string;
}

// Create new customer
export async function createCustomer(
  data: CreateCustomerData
): Promise<Customer> {
  try {
    const response = await api.post(
      `organizations/${data.organizationId}/customers`,
      data
    );
    return response.data as Customer;
  } catch (error) {
    throw error;
  }
}
// Get all customers
export async function getCustomers(
  organizationId: string
): Promise<Customer[]> {
  try {
    const response = await api.get(`organizations/${organizationId}/customers`);
    // Extract the Customer array from the response
    const data = response.data as { customers: Customer[] };

    return data.customers || [];
  } catch (error) {
    throw new Error(`Failed to fetch customers: ${error}`);
  }
}

export async function getCustomerById(
  organizationId: string,
  id: string
): Promise<Customer> {
  try {
    const response = await api.get(
      `organizations/${organizationId}/customers/id/${id}`
    );
    return response.data as Customer;
  } catch (error) {
    throw new Error(`Failed to fetch customer by id: ${error}`);
  }
}

export async function getCustomerByPhone(
  organizationId: string,
  phone: string
): Promise<Customer> {
  try {
    const response = await api.get(
      `organizations/${organizationId}/customers/phone/${phone}`
    );
    return response.data as Customer;
  } catch (error) {
    throw new Error(`Failed to fetch customer by phone: ${error}`);
  }
}

export async function getCustomersByName(
  organizationId: string,
  name: string
): Promise<Customer[]> {
  try {
    const response = await api.get(
      `organizations/${organizationId}/customers/name/${name}`
    );
    console.log('Search API response:', response.data);

    // Check if response has customers property like the getCustomers function
    const data = response.data as { customers?: Customer[] } | Customer[];

    if (Array.isArray(data)) {
      return data;
    } else if (data && 'customers' in data) {
      return data.customers || [];
    } else {
      return [];
    }
  } catch (error) {
    throw new Error(`Failed to fetch customers by name: ${error}`);
  }
}

// Update customer
export async function updateCustomer(
  organizationId: string,
  id: string,
  data: UpdateCustomerData
): Promise<Customer> {
  try {
    const response = await api.patch(
      `organizations/${organizationId}/customers/id/${id}`,
      data
    );
    return response.data as Customer;
  } catch (error) {
    throw new Error(`Failed to update customer: ${error}`);
  }
}

// Delete customer
// export async function deleteCustomer(
//   organizationId: string,
//   id: string
// ): Promise<void> {
//   try {
//     await api.delete(`organizations/${organizationId}/customers/id/${id}`);
//   } catch (error) {
//     throw new Error(`Failed to delete customer: ${error}`);
//   }
// }
