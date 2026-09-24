import { inject } from '@angular/core';
import { CanActivateFn, RedirectCommand, Router } from '@angular/router';
import { AdminAuthService } from '../admin-auth-service';

export const adminGuard: CanActivateFn = () => {
  const adminAuth = inject(AdminAuthService);
  const router = inject(Router);

  if (!adminAuth.isAdminAuthenticated()) {
    return new RedirectCommand(
      router.createUrlTree(['/admin/login']),
      { skipLocationChange: false }
    );
  }

  if (!adminAuth.isAdmin()) {
    return new RedirectCommand(
      router.createUrlTree(['/']),
      { skipLocationChange: false }
    );
  }

  return true;
};
