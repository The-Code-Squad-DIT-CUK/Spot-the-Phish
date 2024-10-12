'use client';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const withAuth = (WrappedComponent) => {
  const WithAuthComponent = (props) => {
    const router = useRouter();

    useEffect(() => {
      try {
        const userInfo = localStorage.getItem('userInfo');
        if (!userInfo) {
          router.replace('/login');
        }
      } catch (error) {
        console.error('Error accessing localStorage:', error);
        router.replace('/login');
      }
    }, [router]);

    return <WrappedComponent {...props} />;
  };

  WithAuthComponent.displayName = `WithAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return WithAuthComponent;
};

export default withAuth;
