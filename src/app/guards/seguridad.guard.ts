import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { SesionUsuarioService } from '../services/sesion-usuario.service';
import { MatSnackBar } from '@angular/material/snack-bar';

export const seguridadGuard = (route: ActivatedRouteSnapshot) => {
  const login = inject(SesionUsuarioService);
  const router = inject(Router);

  if (!login.estaLogeado()) {
    const snackBar = inject(MatSnackBar);
    snackBar.open(
      'No tiene permisos para entrar a esta página, no ha hecho login.',
      'Cerrar',
      {
        duration: 3000,
      }
    );
    router.navigate(['/inicio']);
    return false;
  }

  const expectedRoles: string[] = route.data['roles'] ?? [];
  const userRoles = login.getRoles();

  const hasAccess = expectedRoles.some((role) => userRoles.includes(role));

  if (!expectedRoles) {
    return true;
  }

  if (!hasAccess) {
    const snackBar = inject(MatSnackBar);
    snackBar.open(
      'Acceso restringido. Usted no tiene los permisos necesarios.',
      'Cerrar',
      {
        duration: 3000,
      }
    );
    router.navigate(['/inicio']);
    return false;
  }

  return true;
};
