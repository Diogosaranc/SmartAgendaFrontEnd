'use client';

import OrganizationNotFound from '@/components/ui/OrganizationNotFound';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface OrganizationLayoutProps {
  children: React.ReactNode;
}

export default function OrganizationLayout({
  children,
}: OrganizationLayoutProps) {
  const params = useParams();
  const router = useRouter();
  const organizationId = params?.organizationId;
  const [shouldRedirect, setShouldRedirect] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [countdown, setCountdown] = useState(3);

  const isInvalidOrganization =
    !organizationId || organizationId === '' || organizationId === 'null';

  // Redirect if no organizationId or if it's invalid
  useEffect(() => {
    if (isInvalidOrganization) {
      // Set redirect flag immediately to show the message
      setShouldRedirect(true);

      // Start countdown
      const countdownInterval = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);

      // Set up redirect timer separately
      const redirectTimer = setTimeout(() => {
        router.push('/home');
      }, 3000);

      return () => {
        clearInterval(countdownInterval);
        clearTimeout(redirectTimer);
      };
    }
  }, [isInvalidOrganization, router]);

  if (shouldRedirect) {
    return <OrganizationNotFound />;
  }

  // Render children if organizationId is valid
  return <>{children}</>;
}
