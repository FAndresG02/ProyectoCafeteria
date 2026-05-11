import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogClose, MatDialogContent } from '@angular/material/dialog';
import { CategoryService } from '../../../../services/category-service';
import { Snackbar } from '../../../../services/snackbar';
import { GlobalConstants } from '../../shared/global-constants';
import { COMMON_IMPORTS } from '../../shared/common.imports';
import { MATERIAL_IMPORTS } from '../../shared/material.imports';

@Component({
  selector: 'app-category',
  imports: [
    ...COMMON_IMPORTS,
    ...MATERIAL_IMPORTS
  ],
  templateUrl: './category.html',
  styleUrl: './category.scss',
})
export class Category implements OnInit {
  //Eventos personalizados que avisan al padre sobre un accion
  onAddCategory = new EventEmitter;
  onEditCategory = new EventEmitter;

  //Formulario que se llenara con los detalles del productos que se enviaran al padre
  categoryForm: any = FormGroup;
  //Permite dara respuestas al usuario
  responseMessage: any;

  //Permite controlar el comportamiento del componente segun sel modo que se habre el dialogo 
  dialogAction: any = "Add"; // Se usa en el Html mostraria en el modal (Add || Edit)
  action: any = "Add"; // se usa en la logica de ts y decidir qué método ejecutar (add o update)

  constructor(
    //Este funciona como el componente hijo donde recibira instrucciones del padre 
    //En este caso la accion Add o Edit 
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    //Permite construir el formulario 
    private formBuilder: FormBuilder,
    //Inyeccion para uso de los servicios en categoryService
    private categoryService: CategoryService,
    //Permite cerrar el dialogo despues del registro
    public dialogRef: MatDialogRef<Category>,
    //Inyeccion del servico de snackbarService para mostrar mensajes al usuario
    private snackbarService: Snackbar
  ) { }

  ngOnInit(): void {

    //Inicializa el formulario con validaciones  estos datos deben ser los mismos que se reciben en el backend
    this.categoryForm = this.formBuilder.group({
      name: [null, [Validators.required]]
    });

    //Si los datos enviados por el padre dicen Edit
    if (this.dialogData.action === 'Edit') {
      //La variable dialogAction cambia a Edit y dira en el titulo Editar
      this.dialogAction = "Edit";
      //He indica que se va actualizar no crear usara en la logica actualizar
      this.action = "Update";
      //finalmente llena el formulario con los datos existentes
      this.categoryForm.patchValue(this.dialogData.data);
    }

  }

  handleSubmit() {
    if (this.dialogAction === "Edit") {
      this.edit();
    } else {
      this.add();
    }
  }

  add() {

    //Extraemos los datos del formulario
    var formData = this.categoryForm.value;
    //construimos la data para pasarle al backend
    var data = {
      name: formData.name
    }

    //nos subcribimos al metodo para crear
    this.categoryService.add(data).subscribe((response: any) => {
      //Cerrar el diálogo después de mostrar el mensaje
      this.dialogRef.close();
      //Emitimos la accion al padre en este caso Añadir un producto
      this.onAddCategory.emit();
      //Obtener el mensaje de respuesta del backend
      this.responseMessage = response.message;
      //Mostrar el mensaje de éxito al usuario
      this.snackbarService.openSnackBar(this.responseMessage, "Exito")

    }, (error) => {

      this.dialogRef.close();
      if (error.error?.message) {
        this.responseMessage = error.error?.message;
      } else {
        this.responseMessage = GlobalConstants.genericErrorMessage;
      }

      this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error);

    })
  }

  edit() {
    //Extraemos los datos del formulario
    var formData = this.categoryForm.value;
    //construimos la data para pasarle al backend
    var data = {
      //Recibe el id del padre 
      id: this.dialogData.data.id,
      name: formData.name
    }

    //nos subcribimos al metodo para crear
    this.categoryService.update(data).subscribe((response: any) => {
      //Cerrar el diálogo después de mostrar el mensaje
      this.dialogRef.close();
      //Emitimos la accion al padre en este caso Editar un producto
      this.onEditCategory.emit();
      //Obtener el mensaje de respuesta del backend
      this.responseMessage = response.message;
      //Mostrar el mensaje de éxito al usuario
      this.snackbarService.openSnackBar(this.responseMessage, "Exito")

    }, (error) => {

      this.dialogRef.close();
      if (error.error?.message) {
        this.responseMessage = error.error?.message;
      } else {
        this.responseMessage = GlobalConstants.genericErrorMessage;
      }

      this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error);

    })
  }

}
