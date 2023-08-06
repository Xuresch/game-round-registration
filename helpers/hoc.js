import React from 'react';
import { useRouter } from "next/router";

export function withProtection(Component, options = {}) {
  return function ProtectedComponent({ user, resource, ...props }) {
    const router = useRouter();

    if (!user) {
      console.log('user not found');
      // If user is not yet loaded, show a loading screen or return null
      return null;
    }

    if (options.auth && !user) {
      console.log('user not authenticated');
      // If auth check is enabled and the user is not authenticated,
      // redirect to the login page
      router.push('/login');
      return null;
    }

    if (options.admin && !user.isAdmin && user.id !== resource.ownerId) {
      console.log('user not admin');
      // If admin check is enabled and the user is not an admin or the owner of the resource,
      // or doesn't have a 'gamemaster' role, redirect to a 403 error page
      router.push('/');
      return null;
    }

    if (options.owner && user.id !== resource.ownerId) {
      console.log('user not owner');
      // If owner check is enabled and the user is not the owner of the resource
      // or doesn't have a 'gamemaster' role, redirect to a 403 error page
      router.push('/403');
      return null;
    }

    // If all checks pass, render the original component with all props passed to it
    return <Component user={user} resource={resource} {...props} />;
  };
}
