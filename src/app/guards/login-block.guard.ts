import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { SesionUsuarioService } from '../services/sesion-usuario.service';
import { MatSnackBar } from '@angular/material/snack-bar';

export const loginBlockGuard = () => {
  const login = inject(SesionUsuarioService);
  const router = inject(Router);

  if (login.estaLogeado()) {
    const snackBar = inject(MatSnackBar);
    snackBar.open(
      'Usted ya está logueado, cierre sesión primero.',
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
