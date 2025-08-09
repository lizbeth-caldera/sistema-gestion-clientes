/*
  AppModule:
  - Declara todos los componentes principales
  - Importa módulos de Angular esenciales:
  - Importa módulos de Angular Material usados en la interfaz (botones, iconos, inputs, selects, tablas, etc.)
  - Configura el AuthInterceptor para agregar el token en todas las peticiones HTTP.
  - Define rutas:
      * '/' → LoginComponent
      * '/clientes' → ClientesComponent (protegido con AuthGuard)
      * '/clientes/nuevo' → ClienteFormComponent (alta de cliente)
      * '/clientes/:id' → ClienteFormComponent (edición de cliente)
  - Arranca la app con AppComponent como componente raiz.
*/
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { ClientesComponent } from './clientes/clientes.component';
import { ClienteFormComponent } from './clientes/cliente-form.component';
import { ConfirmDialogComponent } from './shared/confirm-dialog.component';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule } from '@angular/material/dialog';

import { AuthInterceptor } from './auth.interceptor';
import { AuthGuard } from './auth.guard';

const rutas: Routes = [
  { path: '', component: LoginComponent },
  {
    path: 'clientes',
    canActivate: [AuthGuard],
    children: [
      { path: '', component: ClientesComponent },
      { path: 'nuevo', component: ClienteFormComponent },
      { path: ':id', component: ClienteFormComponent },
    ],
  },
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ClientesComponent,
    ClienteFormComponent,
    ConfirmDialogComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
    RouterModule.forRoot(rutas),

    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    MatCardModule,
    MatTableModule,
    MatDialogModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    AuthGuard,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
