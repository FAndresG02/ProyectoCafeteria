import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogClose } from '@angular/material/dialog';
import { COMMON_IMPORTS } from '../../shared/common.imports';
import { MATERIAL_IMPORTS } from '../../shared/material.imports';

@Component({
  selector: 'app-confirmation',
  imports: [
    ...COMMON_IMPORTS,
    ...MATERIAL_IMPORTS
  ],
  templateUrl: './confirmation.html',
  styleUrl: './confirmation.scss',
})
export class Confirmation implements OnInit{

  //Permite emitir un evento para indicar que se ha cambiado el estado de confirmación
  onEmitStatusChange = new EventEmitter();
  //Almacena los detalles de la confirmación, como el mensaje a mostrar
  details: any = {};

  //@Inject(MAT_DIALOG_DATA) se utiliza para inyectar los datos proporcionados al abrir el diálogo, 
  // permitiendo acceder a la información de confirmación desde la plantilla.
  //data son  los datos enviados por el padre 
  constructor(@Inject(MAT_DIALOG_DATA) private data: any) { }

  ngOnInit(): void {

    // Verifica si se han proporcionado datos de confirmación a través de MAT_DIALOG_DATA
    if (this.data && this.data.confirmation) {
      // Seasigna a la propiedad details para su uso en la plantilla
      this.details = this.data;
    }
  }

  handleChangeAction(){
    this.onEmitStatusChange.emit(true);
  }
}
