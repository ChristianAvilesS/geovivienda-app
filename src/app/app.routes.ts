import { Routes } from '@angular/router';
import { ListadoUsuariosComponent } from './components/usuario/listado-usuarios/listado-usuarios.component';
import { UsuarioComponent } from './components/usuario/usuario.component';
import { DireccionComponent } from './components/direccion/direccion.component';

export const routes: Routes = [
  {
    path: 'usuarios',
    component: UsuarioComponent,
    children: [{ path: 'listado', component: ListadoUsuariosComponent }],
  },
  {
    path: 'direcciones',
    component: DireccionComponent,
    children: [],
  },
];
