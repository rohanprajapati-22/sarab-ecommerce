import { HttpInterceptorFn, HttpRequest } from '@angular/common/http';

/**
 * Admin-scoped endpoints that the admin panel is the only consumer of.
 * The storefront only ever POSTs to /api/Order (to create a customer
 * order), never GETs/PUTs it, so we can safely distinguish the two.
 */
function isAdminEndpoint(req: HttpRequest<unknown>): boolean {
  const method = req.method.toUpperCase();
  const url = req.url;

  if (
    (url.startsWith('/api/Order') || url.includes('/api/Order')) &&
    method !== 'POST'
  ) {
    return true;
  }

  if (url.startsWith('/api/Invoice') || url.includes('/api/Invoice')) {
    return true;
  }

  return false;
}

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  if (typeof window === 'undefined') {
    return next(req);
  }

  const adminToken = window.localStorage.getItem('admin_token');
  const token = window.localStorage.getItem('token');

  // Admin panel calls carry the separate admin session; storefront calls
  // carry the customer session.
  const authToken = isAdminEndpoint(req) ? (adminToken ?? token) : token;

  if (authToken) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${authToken}`
      }
    });
  }

  return next(req);
};
