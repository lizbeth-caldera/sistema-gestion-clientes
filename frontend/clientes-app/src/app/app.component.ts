/*
  AppComponent:
  - Es el componente raiz de la aplicación.
  - Contiene el <router-outlet> en su template, que es el contenedor donde Angular inyecta
  
*/
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {}
