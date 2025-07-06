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
import { ReportesComponent } from './components/reportes/reportes.component';
import { seguridadGuard } from './guards/seguridad.guard';
import { CambiarPasswordComponent } from './components/usuario/cambiar-password/cambiar-password.component';
import { AgregarAdminComponent } from './components/usuario/agregar-admin/agregar-admin.component';
import { loginBlockGuard } from './guards/login-block.guard';
import { VisitaComponent } from './components/visita/visita.component';
import { SeleccionMetodoPagoComponent } from './components/pago/seleccion-metodopago/seleccion-metodopago.component';
import { PagoComponent } from './components/pago/pago.component';
import { FormularioMetodopagoComponent } from './components/pago/formulario-metodopago/formulario-metodopago.component';
import { PagoExitosoComponent } from './components/pago/pago-exitoso/pago-exitoso.component';

export const routes: Routes = [
  {
    path: 'visitas',
    component: VisitaComponent,
  },
  {
    path: 'usuarios',
    component: UsuarioComponent,
    children: [
      {
        path: 'listado',
        component: ListadoUsuariosComponent,
        canActivate: [seguridadGuard],
        data: { roles: ['ADMIN'] },
      },
      {
        path: 'perfil',
        component: PerfilUsuarioComponent,
      },
      { path: 'cambiar-password', component: CambiarPasswordComponent },
      { path: 'agregar-admin', component: AgregarAdminComponent },
    ],
  },
  {
    path: 'medios-pago',
    component: MediopagoComponent,
    canActivate: [seguridadGuard],
    data: { roles: ['ADMIN'] },
    children: [
      { path: 'listado', component: ListadoMediospagoComponent },
      { path: 'insertar', component: InsertareditarMediopagoComponent },
      {
        path: 'ediciones/:id',
        component: InsertareditarMediopagoComponent,
        data: {
          renderMode: 'default',
        },
      },
    ],
  },
  {
    path: 'roles',
    component: RolComponent,
    canActivate: [seguridadGuard],
    data: { roles: ['ADMIN'] },
  },
  {
    path: 'registro',
    component: RegistroComponent,
    canActivate: [loginBlockGuard],
  },
  {
    path: 'inicio-sesion',
    component: InicioSesionComponent,
    canActivate: [loginBlockGuard],
  },
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
            data: {
              renderMode: 'default',
            },
          },
        ],
      },
      {
        path: 'agregar',
        component: AgregarInmueblesComponent,
        canActivate: [seguridadGuard],
        data: { roles: ['VENDEDOR', 'ADMIN'] },
      },
      {
        path: 'editar/:id',
        component: AgregarInmueblesComponent,
        canActivate: [seguridadGuard],
        data: { renderMode: 'default', roles: ['VENDEDOR', 'ADMIN'] },
      },
    ],
  },
  {
    path: 'inicio',
    component: InicioComponent,
    data: { renderMode: 'default' },
  },
  {
    path: 'reportes',
    component: ReportesComponent,
    canActivate: [seguridadGuard],
    data: { roles: ['ADMIN'] },
  },
  { path: '', redirectTo: 'inicio', pathMatch: 'full' },

  {
    path: 'pagos',
    component: PagoComponent,
    //canActivate: [seguridadGuard],
    //data: { roles: ['COMPRADOR', 'ARRENDATARIO', 'ADMIN'] },
    children: [
      {
        path: 'seleccion-metodo-pago',
        component: SeleccionMetodoPagoComponent,
      },
      { path: 'formulario-pago', component: FormularioMetodopagoComponent },
      { path: 'pagoexitoso', component: PagoExitosoComponent },
    ],
  },
];
