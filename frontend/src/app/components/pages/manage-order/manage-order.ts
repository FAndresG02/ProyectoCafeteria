import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../common/shared/material.imports';
import { COMMON_IMPORTS } from '../../common/shared/common.imports';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../../../services/product-service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Snackbar } from '../../../services/snackbar';
import { FacturaService } from '../../../services/factura-service';
import { CategoryService } from '../../../services/category-service';
import { GlobalConstants } from '../../common/shared/global-constants';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-manage-order',
  imports: [
    ...MATERIAL_IMPORTS,
    ...COMMON_IMPORTS
  ],
  templateUrl: './manage-order.html',
  styleUrl: './manage-order.scss',
})
export class ManageOrder implements OnInit {

  //Define las columnas que se van a mostrar en la tabla html
  displayColumns: string[] = ['name', 'category', 'price', 'quantity', 'total', 'edit'];
  //Define el dataSource para la tabla, que se inicializa como un nuevo MatTableDataSource vacío
  dataSource = new MatTableDataSource<any>([]);
  //Define un formulario para gestionar las órdenes, que se inicializa como un FormGroup vacío
  manageOrderForm!: FormGroup;
  //Define un array para almacenar las categorías, otro para los productos
  categories: any[] = [];
  //Define una variable para almacenar  productos filtrados por categoria
  products: any[] = [];
  //Define una variable para almacenar el precio
  price: number = 0;
  //Define una variable para almacenar el monto total de la orden
  totalAmount: number = 0;
  //Define una variable para almacenar el mensaje de respuesta
  responseMessage: string = '';

  constructor(
    //Inyecta el FormBuilder para gestionar los formularios reactivos
    private formBuilder: FormBuilder,
    //Inyecta los servicios definos en CategoryService
    private productService: ProductService,
    //Permite mostrar el sping de carga
    private ngxService: NgxUiLoaderService,
    //Permite mostrar mensajes al usuario
    private snackbarService: Snackbar,
    //Inyecta los servicios definos en FacturaService
    private facturaService: FacturaService,
    //Inyecta los servicios definos en CategoryService
    private categoryService: CategoryService,

    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.ngxService.start();
    //Carga el metodo para extraer las categorias
    this.getCategorys();

    //Inicializa el formulario con los campos necesarios para gestionar las órdenes, aplicando validaciones
    this.manageOrderForm = this.formBuilder.group({
      name: [null, [Validators.required, Validators.pattern(GlobalConstants.nameRegex)]],
      email: [null, [Validators.required, Validators.pattern(GlobalConstants.emailRegex)]],
      contactNumber: [null, [Validators.required, Validators.pattern(GlobalConstants.contactNumberRegex)]],
      paymentMethod: [null, [Validators.required]],
      product: [null, [Validators.required]],
      category: [null, [Validators.required]],
      quantity: [null, [Validators.required]],
      price: [null, [Validators.required]],
      total: [null, [Validators.required]]
    });
  }

  //Metodo para extraer todos los productos al cargar el componente aplicando un filtro 
  //extraen solo las categorias que tienen productos asociados, 
  //lo que es util para mostrar solo las categorias disponibles al gestionar las órdenes
  getCategorys() {
    this.categoryService.getFilteredCategorys().subscribe((response: any) => {
      this.ngxService.stop();
      //Asigna la respuesta a la variable categorys, que se usará para mostrar las categorías en el formulario
      this.categories = response;
      //Detecta los cambios para actualizar la vista con las categorías filtradas,
      this.cdr.detectChanges();
    }, (error) => {
      this.ngxService.stop();
      console.log(error.error?.message);
      if (error.error?.message) {
        this.responseMessage = error.error?.message;
      } else {
        this.responseMessage = GlobalConstants.genericErrorMessage;
      }
      this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error);
    });
  }

  //Metodo para extraer los productos filtrados por categoria al seleccionar una categoria en el formulario
  getProductsByCategory(value: any) {
    this.productService.getByCategory(value.id).subscribe((response: any) => {
      //Asigna la respuesta a la variable products, que se usará para mostrar los productos en el formulario
      this.products = response;

      //Resetea los campos de precio, cantidad y total al cambiar de categoria
      //Esto es necesario porque el precio y el total dependen del producto seleccionado, 
      //y al cambiar de categoria los productos disponibles cambian
      this.manageOrderForm.controls['price'].setValue(null);
      this.manageOrderForm.controls['quantity'].setValue(null);
      this.manageOrderForm.controls['total'].setValue(null);

    }, (error) => {
      console.log(error.error?.message);
      if (error.error?.message) {
        this.responseMessage = error.error?.message;
      } else {
        this.responseMessage = GlobalConstants.genericErrorMessage;
      }
      this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error);
    });
  }

  //Metodo para extraer los detalles del producto seleccionado en el formulario, 
  //como el precio, para calcular el total de la orden
  getProductDetails(value: any) {
    this.productService.getProductById(value.id).subscribe((response: any) => {
      //Asigna el precio del producto seleccionado a la variable price, que se usará para calcular el total
      this.price = response.price;
      // Asigna el precio del producto seleccionado al campo de precio del formulario, 
      // para mostrarlo al usuario y facilitar la gestión de la orden
      this.manageOrderForm.controls['price'].setValue(response.price);
      // Inicializa la cantidad en 1 y el total en el precio del producto, 
      // para facilitar la gestión de la orden al usuario,
      this.manageOrderForm.controls['quantity'].setValue('1');
      // Calcula el total multiplicando el precio por la cantidad, y lo asigna al campo total del formulario
      this.manageOrderForm.controls['total'].setValue(this.price * 1);

    }, (error) => {
      console.log(error.error?.message);
      if (error.error?.message) {
        this.responseMessage = error.error?.message;
      } else {
        this.responseMessage = GlobalConstants.genericErrorMessage;
      }
      this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error);
    });
  }

  //Metodo para calcular el total de la orden al cambiar la cantidad, multiplicando el precio por la cantidad
  setQuantity(value: any) {
    //Obtiene el valor de la cantidad del formulario y lo asigna a la variable tem
    var tem = this.manageOrderForm.controls['quantity'].value;
    //Si tem es mayor a 0, calcula el total multiplicando el precio por la cantidad y 
    //lo asigna al campo total del formulario
    if (tem > 0) {
      this.manageOrderForm.controls['total'].setValue(
        this.manageOrderForm.controls['quantity'].value * this.manageOrderForm.controls['price'].value
      );
      //Si tem es igual a 0, resetea el campo de cantidad y total del formulario, 
      //para evitar que se muestre un total de 0 o negativo
    } else if (tem == 0) {
      this.manageOrderForm.controls['quantity'].setValue('1');
      this.manageOrderForm.controls['total'].setValue(
        this.manageOrderForm.controls['quantity'].value * this.manageOrderForm.controls['price'].value
      );
    }
  }

  // Metodo para validar el formulario antes de agregar la orden
  validateProductAdd() {
    //verifica que el total no sea 0 o null, y que la cantidad sea mayor a 0
    //esto para evitar que se agreguen órdenes con total de 0 o cantidad negativa, 
    //lo que no tendría sentido en una orden
    if (this.manageOrderForm.controls['total'].value === 0 ||
      this.manageOrderForm.controls['total'].value === null ||
      this.manageOrderForm.controls['quantity'].value <= 0
    ) {
      return true;
    } else {
      return false;
    }
  }

  //Metodo para validar el formulario antes de enviar la orden, 
  validateSubmit() {
    //verifica que todos los campos requeridos estén llenos y que el total no sea 0
    if (this.totalAmount === 0 ||
      this.manageOrderForm.controls['name'].value === null ||
      this.manageOrderForm.controls['email'].value === null ||
      this.manageOrderForm.controls['contactNumber'].value === null ||
      this.manageOrderForm.controls['paymentMethod'].value === null
    ) {
      return true;
    } else {
      return false;
    }
  }

  // Metodo para agregar una orden a la tabla, que se ejecuta al hacer clic en el botón "Agregar" en el formulario
  add() {
    //Obtiene los valores del formulario y los asigna a la variable formData
    var formData = this.manageOrderForm.value;
    //Busca en el dataSource de la tabla si ya existe una orden con el mismo producto, 
    // usando el id del producto para comparar
    var productName = this.dataSource.data.find(
      (e: { id: number }) => e.id === formData.product.id
    );

    //Si no existe una orden con el mismo producto, agrega la nueva orden al dataSource de la tabla,
    if (productName === undefined) {

      //Actualiza el monto total de la orden sumando el total de la nueva orden,
      this.totalAmount += formData.total;
      //Agrega la nueva orden al dataSource de la tabla, creando un nuevo objeto con los 
      //datos necesarios para mostrar en la tabla
      this.dataSource.data.push({
        id: formData.product.id,
        name: formData.product.name,
        category: formData.category.name,
        price: formData.price,
        quantity: formData.quantity,
        total: formData.total
      });

      //Actualiza el dataSource de la tabla para reflejar los cambios, 
      //creando una nueva instancia del array de datos,
      this.dataSource.data = [...this.dataSource.data];

      this.snackbarService.openSnackBar("Orden agregada correctamente", "success");
    }
  }

  //Metodo para eliminar una orden de la tabla, que se ejecuta al hacer clic en el botón 
  //"Eliminar" en la fila de la tabla
  handleDeleteAction(value: any, element: any) {
    //Actualiza el monto total de la orden restando el total de la orden eliminada,
    this.totalAmount -= element.total;
    //Elimina la orden del dataSource de la tabla usando el índice de la orden en el array de datos
    //El método splice() se utiliza para eliminar un elemento del array en el índice especificado 
    //(value) y eliminar 1 elemento (el orden seleccionado)
    this.dataSource.data.splice(value, 1);
    //Actualiza el dataSource de la tabla para reflejar los cambios, creando una nueva instancia del array de datos,
    this.dataSource.data = [...this.dataSource.data];

    this.snackbarService.openSnackBar("Orden eliminada correctamente", "success");
  }

  //Metodo para enviar la orden, que se ejecuta al hacer clic en el botón "Enviar Orden" en el formulario
  submitAction() {
    //Obtiene los valores del formulario y los asigna a la variable formData
    var formData = this.manageOrderForm.value;
    //Crea un objeto data con los datos necesarios para generar el reporte de la orden,
    var data = {
      name: formData.name,
      email: formData.email,
      contactNumber: formData.contactNumber,
      paymentMethod: formData.paymentMethod,
      totalAmount: this.totalAmount.toString(),
      productDetails: JSON.stringify(this.dataSource.data)
    }

    console.log("Data enviada:", JSON.stringify(data));

    //Muestra el spinner de carga mientras se genera el reporte de la orden,
    this.ngxService.start();

    //Llama al servicio de factura para generar el reporte de la orden, pasando el objeto data como parámetro
    this.facturaService.generateReport(data).subscribe((response: any) => {

      //se descarga el archivo PDF del reporte usando el método downloadFile, 
      //pasando el UUID del archivo como parámetro,
      this.downloadFile(response?.uuid);
      //y se resetea el formulario, se limpia la tabla y se reinicia el monto total
      //para permitir gestionar una nueva orden
      this.manageOrderForm.reset();
      //Al resetear el formulario, los campos de categoría y producto se establecen en null, 
      //lo que hace que se oculten los campos de precio, cantidad y total,
      this.dataSource.data = [];
      // Esto es necesario porque el precio, la cantidad y el total dependen del producto seleccionado,
      // y al resetear el formulario no hay un producto seleccionado, por lo que estos campos se ocultan 
      // para evitar confusión al usuario
      this.totalAmount = 0;
    }, (error) => {
      console.log(error.error?.message);
      console.log('Error completo:', error.error);
      if (error.error?.message) {
        this.responseMessage = error.error?.message;
      } else {
        this.responseMessage = GlobalConstants.genericErrorMessage;
      }
      this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error);
    });

  }

  //Metodo para descargar el archivo PDF del reporte de la orden, 
  //que se ejecuta después de generar el reporte exitosamente
  downloadFile(fileName: any) {
    // rea un objeto data con el UUID del archivo, 
    //que se usará para solicitar el archivo al backend
    var data = {
      uuid: fileName
    }

    //Llama al servicio de factura para obtener el archivo PDF del reporte de la orden, 
    // pasando el objeto data como parámetro
    this.facturaService.getPdf(data).subscribe((response: any) => {
      saveAs(response, fileName + '.pdf');
      this.ngxService.stop();
    })
  }



}
