import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ClientesService, Cliente } from './clientes.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../shared/confirm-dialog.component';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.scss']
})
export class ClientesComponent implements OnInit {

  /* =======================
     Estado básico de la vista
     ======================= */
  clientes: Cliente[] = [];
  // columnas a pintar en la tabla 
  displayedColumns: string[] = ['razon_social', 'rfc', 'documento', 'acciones'];

  constructor(
    private api: ClientesService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  /* =======================
     Carga inicial
     ======================= */
  ngOnInit(): void {
    // Trae el listado completo de clientes
    this.api.list().subscribe(data => this.clientes = data);
  }

  /* =======================
     Acciones de fila
     ======================= */

  // Ir a la pantalla de edición con el id del cliente
  editar(c: Cliente): void {
    this.router.navigate(['/clientes', c.id]);
  }

  // Confirmar y eliminar; si acepta, llamamos API y sacamos del array local
  eliminar(c: Cliente): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Eliminar cliente',
        message: `¿Estás seguro de eliminar a "${c.razon_social}"?`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.api.delete(c.id).subscribe(() => {
          // quitamos el registro de la tabla sin recargar toda la lista
          this.clientes = this.clientes.filter(x => x.id !== c.id);
        });
      }
    });
  }

  /* =======================
     Sesión
     ======================= */

  // Logout simple: limpiamos storage y regresamos al login
  logout(): void {
    localStorage.clear();
    this.router.navigate(['/']);
  }
}
