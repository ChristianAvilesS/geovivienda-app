import { Routes } from '@angular/router';
import { ListadoUsuariosComponent } from './components/usuario/listado-usuarios/listado-usuarios.component';
import { UsuarioComponent } from './components/usuario/usuario.component';
import { DireccionComponent } from './components/direccion/direccion.component';
import { InmuebleComponent } from './components/inmueble/inmueble.component';
import { ListadoInmueblesComponent } from './components/inmueble/listado-inmuebles/listado-inmuebles.component';

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
  {
    path: 'inmuebles',
    component: InmuebleComponent,
    children: [{ path: 'listado', component: ListadoInmueblesComponent }],
  },
];
