import { HttpInterceptorFn } from '@angular/common/http';
import { SesionUsuarioService } from './sesion-usuario.service';
import { inject } from '@angular/core';

export const authInterceptorFn: HttpInterceptorFn = (req, next) => {
  const sesionUsuarioService = inject(SesionUsuarioService);
  const token = sesionUsuarioService.getToken();


  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  return next(req);
};
