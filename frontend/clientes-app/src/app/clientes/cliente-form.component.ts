import { Component, OnInit } from '@angular/core';
import {
  FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientesService, Cliente } from './clientes.service';
import { finalize } from 'rxjs/operators';

/* =======================
   Regex básicos
   ======================= */
const RFC   = /^[A-Z&Ñ]{3,4}\d{6}[A-Z0-9]{3}$/i;
const PHONE = /^(\d[\s-]?){10}$/;

/* =======================
   Validador de documento
   - Requiere doc si el tipo es FISICA/MORAL
   - En edición: si ya hay documento actual, no obliga a subir otro
   ======================= */
function documentoObligatorioFactory(getTipo: () => string, hasCurrentDoc: () => boolean) {
  return (ctrl: AbstractControl): ValidationErrors | null => {
    const tipo = getTipo();
    const requerido = tipo === 'FISICA' || tipo === 'MORAL';
    if (!requerido) return null;     // si no aplica, no valida
    if (ctrl.value) return null;     // ya hay archivo nuevo
    if (hasCurrentDoc()) return null;// en edición y con doc existente, ok
    return { required: true };       // toca subir archivo
  };
}

@Component({
  selector: 'app-cliente-form',
  templateUrl: './cliente-form.component.html',
  styleUrls: ['./cliente-form.component.scss']
})
export class ClienteFormComponent implements OnInit {

  /* =======================
     Estado del componente
     ======================= */
  form!: FormGroup;
  editMode = false;
  loading = false;
  id!: number;
  selectedFileName: string | null = null;

  // Si hay un documento previo (edición), mostramos el boton de descarga
  currentDocumentoUrl: string | null = null;

  constructor(
    private fb: FormBuilder,
    private api: ClientesService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  /* =======================
     Ciclo de vida
     - arma el form
     - si viene id, carga datos
     ======================= */
  ngOnInit(): void {
    // Form reactivo con validaciones mínimas
    this.form = this.fb.group({
      razon_social: ['', Validators.required],
      tipo_persona: ['FISICA', Validators.required],
      rfc: ['', [Validators.required, Validators.pattern(RFC)]],
      representante_legal: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required, Validators.pattern(PHONE)]],
      documento: [null]
    });

    // Valida documento que toma en cuenta modo edición
    const docCtrl = this.form.get('documento')!;
    docCtrl.addValidators(
      documentoObligatorioFactory(
        () => this.form.get('tipo_persona')!.value,
        () => !!this.currentDocumentoUrl
      )
    );

    // Si cambia el tipo de persona, cambiamos el nombre del documento
    this.form.get('tipo_persona')!.valueChanges.subscribe(() => {
      docCtrl.updateValueAndValidity();
    });

    // Si hay parámetro :id => modo edición
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.editMode = true;
      this.id = +idParam;

      // Cargamos el cliente de la API
      this.api.get(this.id).subscribe(c => {
        const tipo = this.normalizeTipo((c as any)?.tipo_persona); // normaliza entrada

        // Llenamos el form (documento nuevo se sube manual)
        this.form.patchValue({
          razon_social: c.razon_social,
          tipo_persona: tipo,
          rfc: c.rfc,
          representante_legal: c.representante_legal,
          email: c.email,
          telefono: c.telefono,
          documento: null
        });

        // Guardamos URL del documento actual (si hay)
        this.currentDocumentoUrl = (c as any)?.documento || null;

        // Revalida con contexto de edición 
        docCtrl.updateValueAndValidity({ emitEvent: false });
      });
    }
  }

  /* =======================
     Utilidades
     ======================= */

  // Normaliza variantes para que el select no se rompa (FISICA/MORAL)
  private normalizeTipo(v: any): 'FISICA' | 'MORAL' {
    const s = String(v ?? '')
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '')
      .toUpperCase()
      .trim();

    if (s.includes('MORAL') || s === 'M') return 'MORAL';
    return 'FISICA';
  }

  // Cuando cambian el tipo a mano, forzamos valor y revalidamos documento a cargar
  onTipoChange(tipo: 'FISICA' | 'MORAL'): void {
    this.form.get('tipo_persona')!.setValue(tipo, { emitEvent: true });
    this.form.get('documento')!.updateValueAndValidity();
    // Si no hay archivo seleccionado, no hacemos nada extra;
  }

  // Texto guía para la drop-zone según el tipo
  get tipoPersonaTexto(): string {
    const tipo = this.form?.get('tipo_persona')?.value;
    if (tipo === 'FISICA') return 'Sube la Identificación Oficial';
    if (tipo === 'MORAL')  return 'Sube el Acta Constitutiva';
    return 'Sube el Documento';
  }

  /* =======================
     Manejo de archivo (input file)
     ======================= */
  onFile(e: Event): void {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;

    this.selectedFileName = file.name;

    // Backend estilo base64 (DataURL)
    const reader = new FileReader();
    reader.onload = () => {
      this.form.get('documento')!.setValue(reader.result);
      this.form.get('documento')!.updateValueAndValidity();
    };
    reader.readAsDataURL(file);
  }

  // Drag & drop
  onDrop(event: DragEvent): void {
    event.preventDefault();
    const file = event.dataTransfer?.files?.[0];
    if (!file) return;

    this.selectedFileName = file.name;

    const reader = new FileReader();
    reader.onload = () => {
      this.form.get('documento')!.setValue(reader.result);
      this.form.get('documento')!.updateValueAndValidity();
    };
    reader.readAsDataURL(file);
  }

  // Necesario para permitir el drop
  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  /* =======================
     Submit / navegación
     ======================= */
  submit(): void {
    if (this.form.invalid) return;
    this.loading = true;

    const payload = this.form.value as Cliente;

    // Decidimos si creamos o actualizamos
    const op$ = this.editMode
      ? this.api.update(this.id, payload)
      : this.api.create(payload);

    // finalize: siempre apaga loading
    op$.pipe(finalize(() => (this.loading = false))).subscribe({
      next: () => this.router.navigate(['/clientes']),
      error: err => alert(err?.error?.msg ?? 'Error')
    });
  }

  // Botón cancelar = back a listado
  cancel(): void {
    this.router.navigate(['/clientes']);
  }
}
