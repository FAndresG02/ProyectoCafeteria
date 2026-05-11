import { ChangeDetectorRef, Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../shared/material.imports';
import { COMMON_IMPORTS } from '../../shared/common.imports';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../../../../services/product-service';
import { Snackbar } from '../../../../services/snackbar';
import { CategoryService } from '../../../../services/category-service';
import { GlobalConstants } from '../../shared/global-constants';

@Component({
  selector: 'app-product',
  imports: [
    ...MATERIAL_IMPORTS,
    ...COMMON_IMPORTS
  ],
  templateUrl: './product.html',
  styleUrl: './product.scss',
})
export class Product implements OnInit {

  //Eventos personalizados que avisan al padre sobre un accion
  onAddProduct = new EventEmitter;
  onEditProduct = new EventEmitter;

  //Formulario que se llenara con los detalles del productos que se enviaran al padre
  productForm: any = FormGroup;
  //Permite dara respuestas al usuario
  responseMessage: any;
  //Se almacenaran las categorias para relacionarlas con los productos
  categorys: any = [];

  //Permite controlar el comportamiento del componente segun sel modo que se habre el dialogo 
  dialogAction: any = "Add"; // Se usa en el Html mostraria en el modal (Add || Edit || Delete)
  action: any = "Add"; // se usa en la logica de ts y decidir qué método ejecutar (add, update o delete)

  constructor(
    //Este funciona como el componente hijo donde recibira instrucciones del padre 
    //En este caso la accion Add o en el caso de Edit su accion y los datos del producto
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    //Permite construir el formulario 
    private formBuilder: FormBuilder,
    //Inyeccion para uso de los servicios en ProductService
    private productService: ProductService,
    //Inyeccion para uso de los servicios de CategoryService
    private categoryService: CategoryService,
    //Permite cerrar el dialogo despues del registro
    public dialogRef: MatDialogRef<Product>,
    //Inyeccion del servico de snackbarService para mostrar mensajes al usuario
    private snackbarService: Snackbar,
    
    private cdr: ChangeDetectorRef

  ) { }

  ngOnInit(): void {
    //Inicializacion del formulario con validaciones estos datos deben ser los mismos que se reciben en el backend
    this.productForm = this.formBuilder.group({
      categoryId: [null, [Validators.required]],
      name: [null, [Validators.required, Validators.pattern(GlobalConstants.nameRegex)]],
      description: [null, [Validators.required]],
      price: [null, [Validators.required]]
    })

    //Si los datos enviados por el padre dicen Edit
    if (this.dialogData.action === 'Edit') {
      //La variable dialogAction cambia a Edit y dira en el titulo Editar
      this.dialogAction = "Edit";
      //He indica que se va actualizar no crear usara en la logica actualizar
      this.action = "Update";
      //finalmente llena el formulario con los datos existentes
      this.productForm.patchValue(this.dialogData.data);
    }

    //Se obtine las categorias de los productos 
    this.getCategorys();
  }

  getCategorys() {
    this.categoryService.get().subscribe((reponse: any) => {
      this.categorys = reponse;
      this.cdr.detectChanges();
    }, (error) => {
      console.log(error);
      if (error.error?.message) {
        this.responseMessage = error.error?.message;
      } else {
        this.responseMessage = GlobalConstants.genericErrorMessage;
      }

      this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error);
    })
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
    var formData = this.productForm.value;
    //construimos la data para pasarle al backend
    var data = {
      categoryId: formData.categoryId,
      name: formData.name,
      description: formData.description,
      price: formData.price
    }

    //nos subcribimos al metodo para crear
    this.productService.add(data).subscribe((response: any) => {
      //Cerrar el diálogo después de mostrar el mensaje
      this.dialogRef.close();
      //Emitimos la accion al padre en este caso Añadir un producto 
      this.onAddProduct.emit();
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
    var formData = this.productForm.value;
    //construimos la data para pasarle al backend
    var data = {
      id: this.dialogData.data.id,
      categoryId: formData.categoryId,
      name: formData.name,
      description: formData.description,
      price: formData.price
    }

    //nos subcribimos al metodo para crear
    this.productService.add(data).subscribe((response: any) => {
      //Cerrar el diálogo después de mostrar el mensaje
      this.dialogRef.close();
      //Emitimos la accion al padre en este caso Editar un producto 
      this.onEditProduct.emit();
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
