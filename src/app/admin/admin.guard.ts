import { inject } from '@angular/core';
import { CanActivateFn, RedirectCommand, Router } from '@angular/router';
import { AuthService } from '../auth-service';

export const adminGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!auth.isAuthenticated()) {
    return new RedirectCommand(
      router.createUrlTree(['/admin/login']),
      { skipLocationChange: false }
    );
  }

  if (!auth.isAdmin()) {
    return new RedirectCommand(
      router.createUrlTree(['/']),
      { skipLocationChange: false }
    );
  }

  return true;
};