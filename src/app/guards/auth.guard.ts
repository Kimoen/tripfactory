import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
    const auth = inject(Auth);
    const router = inject(Router);

    // Check if accessing in guest mode
    const isGuestMode = route.queryParams['mode'] === 'guest';

    if (isGuestMode) {
        // Allow access in guest mode without authentication
        return true;
    }

    // For admin mode, check authentication
    return new Promise<boolean>((resolve) => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                // User is authenticated, allow access
                resolve(true);
            } else {
                // User is not authenticated, redirect to login
                router.navigate(['/login']);
                resolve(false);
            }
        });
    });
};
