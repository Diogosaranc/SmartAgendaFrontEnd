import { useParams } from 'next/navigation';

/**
 * Hook to get a validated organizationId from route parameters
 * This should only be used within pages that are protected by OrganizationLayout
 * @returns organizationId as a string (guaranteed to be valid)
 */
export function useOrganizationId(): string {
  const params = useParams();
  const organizationId = params?.organizationId as string;

  return organizationId;
}
