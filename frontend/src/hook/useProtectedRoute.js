import { useEffect } from 'react';
import { useAuthStore } from '../store/store';

export const useRouteProtection = () => {
  const { isAuthenticated, user, logout } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated || !user) return;

    const allowedPaths = ['/hero', '/form'];
    const protectedPaths = ['/hero']; // Only apply strict protection to hero route
    
    // Function to check and redirect if necessary
    const checkAndRedirect = () => {
      const currentPath = window.location.pathname;
      
      // Only redirect if user is on a non-allowed path
      if (!allowedPaths.includes(currentPath)) {
        window.history.replaceState(null, null, '/hero');
      }
    };

    // Check if current path should have strict protection
    const isStrictlyProtected = () => {
      const currentPath = window.location.pathname;
      return protectedPaths.includes(currentPath);
    };

    // Initial check
    checkAndRedirect();

    // Handle browser back/forward navigation - only for hero route
    const handlePopState = (event) => {
      if (isStrictlyProtected()) {
        event.preventDefault();
        checkAndRedirect();
      }
    };

    // Handle manual URL changes - only for hero route
    const handleLocationChange = () => {
      if (isStrictlyProtected()) {
        checkAndRedirect();
      }
    };

    // Handle tab visibility changes - only for hero route
    const handleVisibilityChange = () => {
      if (!document.hidden && isStrictlyProtected()) {
        checkAndRedirect();
      }
    };

    // Handle beforeunload event - only for hero route
    const handleBeforeUnload = (event) => {
      if (isStrictlyProtected()) {
        const message = "Are you sure you want to leave? You will be logged out.";
        event.returnValue = message;
        return message;
      }
    };

    // Add event listeners
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Monitor URL changes (for SPA routing) - only for hero route
    const originalPushState = window.history.pushState;
    const originalReplaceState = window.history.replaceState;

    window.history.pushState = function(...args) {
      originalPushState.apply(window.history, args);
      if (isStrictlyProtected()) {
        handleLocationChange();
      }
    };

    window.history.replaceState = function(...args) {
      originalReplaceState.apply(window.history, args);
      if (isStrictlyProtected()) {
        handleLocationChange();
      }
    };

  
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.history.pushState = originalPushState;
      window.history.replaceState = originalReplaceState;
    };
  }, [isAuthenticated, user]);

  return {
    isProtected: isAuthenticated && user,
    // allowedPaths: ['/hero', '/form'],
    allowedPaths: ['/hero'],
    protectedPaths: ['/hero'],
    forceLogout: logout,
  };
};

// Additional hook for blocking specific actions
export const useBlockNavigation = (shouldBlock = true) => {
  const { isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    if (!shouldBlock || !isAuthenticated || !user) return;

    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = "Changes may not be saved. Are you sure you want to leave?";
      return "Changes may not be saved. Are you sure you want to leave?";
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [shouldBlock, isAuthenticated, user]);
};