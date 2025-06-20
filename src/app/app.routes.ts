import { Routes } from '@angular/router';
import { ListadoUsuariosComponent } from './components/usuario/listado-usuarios/listado-usuarios.component';
import { UsuarioComponent } from './components/usuario/usuario.component';
import { InmuebleComponent } from './components/inmueble/inmueble.component';
import { ListadoInmueblesComponent } from './components/inmueble/listado-inmuebles/listado-inmuebles.component';
import { InformacionInmuebleComponent } from './components/inmueble/listado-inmuebles/tarjeta-inmueble/informacion-inmueble/informacion-inmueble.component';
import { InicioComponent } from './components/util/inicio/inicio.component';
import { PerfilUsuarioComponent } from './components/usuario/perfil-usuario/perfil-usuario.component';
import { RolComponent } from './components/rol/rol.component';
import { RegistroComponent } from './components/registro/registro.component';
import { InicioSesionComponent } from './components/inicio-sesion/inicio-sesion.component';

export const routes: Routes = [
  {
    path: 'usuarios',
    component: UsuarioComponent,
    children: [
      { path: 'listado', component: ListadoUsuariosComponent },
      {
        path: 'perfil',
        component: PerfilUsuarioComponent,
      },
    ],
  },
  { path: 'roles', component: RolComponent },
  { path: 'registro', component: RegistroComponent },
  { path: 'inicio-sesion', component: InicioSesionComponent },
  {
    path: 'inmuebles',
    component: InmuebleComponent,
    children: [
      {
        path: 'listado',
        component: ListadoInmueblesComponent,
        children: [
          {
            path: 'informacion/:id',
            component: InformacionInmuebleComponent,
          },
        ],
      },
    ],
  },
  {
    path: 'inicio',
    component: InicioComponent,
  },
  { path: '', redirectTo: 'inicio', pathMatch: 'full' },
];
