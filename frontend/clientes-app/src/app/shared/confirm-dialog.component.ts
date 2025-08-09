import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  selector: 'app-confirm-dialog',
  template: `
    <h2 mat-dialog-title class="text-center">
      <mat-icon color="warn">warning</mat-icon>
      Confirmar
    </h2>

    <mat-dialog-content class="pb-3">
      {{ data.msg }}
    </mat-dialog-content>

    <!-- Botones de acción (Cancelar y Eliminar) -->
    <mat-dialog-actions align="end">
      <button mat-button (click)="dialogRef.close(false)">Cancelar</button>
      <button mat-raised-button color="warn" (click)="dialogRef.close(true)">
        Eliminar
      </button>
    </mat-dialog-actions>
  `
})
export class ConfirmDialogComponent {

  /*
    Constructor e inyección de dependencias
    - dialogRef: referencia para cerrar la ventana  y devolver un valor
    - data: objeto con el mensaje a mostrar (inyectado con MAT_DIALOG_DATA)
  */
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { msg: string }
  ) {}
}
