import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  // Formulario
  form!: FormGroup;
  // Bandera para mostrar cargando en el botón
  loading = false;

  constructor(
    private fb: FormBuilder,  // Para crear el formulario
    private auth: AuthService, // Servicio de autenticación
    private router: Router     // Para navegar entre pantallas
  ) {}

  ngOnInit(): void {
    // Armamos el formulario con sus validaciones
    this.form = this.fb.group({
      username: ['', Validators.required], // Usuario obligatorio
      password: ['', Validators.required]  // Contraseña obligatoria
    });
  }

  // Acción que se dispara al enviar el formulario
  login(): void {
    // Si el form es inválido, mejor ni seguimos
    if (this.form.invalid) { return; }

    // Activamos "cargando"
    this.loading = true;

    // Llamamos al servicio de login
    this.auth.login(this.form.value).subscribe({
      next: () => this.router.navigate(['/clientes']), // Si todo va bien, mandamos al listado
      error: () => {
        this.loading = false; // Quitamos el cargando
        alert('Credenciales incorrectas'); // Avisamos de credenciales no validas 
      }
    });
  }
}
