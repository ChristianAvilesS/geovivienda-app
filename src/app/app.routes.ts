import { Routes } from '@angular/router';
import { ListadoUsuariosComponent } from './components/usuario/listado-usuarios/listado-usuarios.component';
import { UsuarioComponent } from './components/usuario/usuario.component';
import { InmuebleComponent } from './components/inmueble/inmueble.component';
import { ListadoInmueblesComponent } from './components/inmueble/listado-inmuebles/listado-inmuebles.component';
import { InformacionInmuebleComponent } from './components/inmueble/listado-inmuebles/tarjeta-inmueble/informacion-inmueble/informacion-inmueble.component';
import { AgregarInmueblesComponent } from './components/inmueble/agregar-inmuebles/agregar-inmuebles.component';
import { InicioComponent } from './components/util/inicio/inicio.component';
import { PerfilUsuarioComponent } from './components/usuario/perfil-usuario/perfil-usuario.component';
import { RolComponent } from './components/rol/rol.component';
import { RegistroComponent } from './components/registro/registro.component';
import { InicioSesionComponent } from './components/inicio-sesion/inicio-sesion.component';
import { MediopagoComponent } from './components/mediopago/mediopago.component';
import { ListadoMediospagoComponent } from './components/mediopago/listado-mediospago/listado-mediospago.component';
import { InsertareditarMediopagoComponent } from './components/mediopago/insertareditar-mediopago/insertareditar-mediopago.component';

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
  {
    path: 'medios-pago',
    component: MediopagoComponent,
    children: [
      { path: 'listado', component: ListadoMediospagoComponent },
      { path: 'insertar', component: InsertareditarMediopagoComponent },
      { path: 'ediciones/:id', component: InsertareditarMediopagoComponent },
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
      {
        path: 'agregar',
        component: AgregarInmueblesComponent,
      },
      {
        path: 'editar/:id',
        component: AgregarInmueblesComponent,
      },
    ],
  },
  {
    path: 'inicio',
    component: InicioComponent,
  },
  { path: '', redirectTo: 'inicio', pathMatch: 'full' },

];
