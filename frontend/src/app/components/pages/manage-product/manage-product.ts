import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../common/shared/material.imports';
import { COMMON_IMPORTS } from '../../common/shared/common.imports';
import { MatTableDataSource } from '@angular/material/table';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Snackbar } from '../../../services/snackbar';
import { Router } from '@angular/router';
import { GlobalConstants } from '../../common/shared/global-constants';
import { ProductService } from '../../../services/product-service';
import { Product } from '../../common/dialog/product/product';
import { Confirmation } from '../../common/dialog/confirmation/confirmation';

@Component({
  selector: 'app-manage-product',
  imports: [
    ...MATERIAL_IMPORTS,
    ...COMMON_IMPORTS
  ],
  templateUrl: './manage-product.html',
  styleUrl: './manage-product.scss',
})
export class ManageProduct implements OnInit {

  displayColumns: String[] = ['name', 'categoryName', 'description', 'price', 'edit'];
  dataSource = new MatTableDataSource<any>([]);
  responseMessage: any;

  constructor(
    private cdr: ChangeDetectorRef,
    //Inyecta los servicios definos en CategoryService
    private productService: ProductService,
    //Permite mostrar el sping de carga
    private ngxService: NgxUiLoaderService,
    //Permite controlar el diaologo del mesnaje
    private dialog: MatDialog,
    //Permite mostrar mensajes al usuario
    private snackbarService: Snackbar,
    //Permite al usuario redirigir a otras paginas 
    private router: Router
  ) { }

  ngOnInit(): void {
    //Inicia el sping de carga
    this.ngxService.start();
    //carga el metodo para extraer las categorias
    this.tableData();
  }

  //Metodo para extraer todos los productos al cargar el componente 
  tableData() {

    this.productService.get().subscribe((response: any) => {

      this.ngxService.stop();

      this.dataSource.data = response;
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

    })

  }

  //Filtrar datos de la tabla mat-table 
  applyFilter(event: Event) {
    //Obtine los que escribio el usuario
    //event.target = es la entrada (input)
    //value = texto escrito por el usuario
    const filterValue = (event.target as HTMLInputElement).value;
    //se aplica al filtro de la tabla y elimina espacio y devulve en miniscula 
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  // Método que se ejecuta al hacer clic en "Añadir Producto"
  handleAddAction() {

    // Crea la configuración del diálogo (modal)
    const dialogConfig = new MatDialogConfig();

    // Datos que se envían al componente del diálogo (en este caso la acción "Add")
    //Estos datos se enviaran al hijo Product
    dialogConfig.data = {
      action: 'Add'
    };

    // Define el ancho del diálogo
    dialogConfig.width = "850px"

    // Abre el diálogo usando el componente Product y la configuración definida
    //Se habre el componente Producto como un diaolog y se le pasa la accion Add
    const dialogRef = this.dialog.open(Product, dialogConfig);

    // Se suscribe a los cambios de ruta para cerrar el diálogo automáticamente si se navega
    this.router.events.subscribe(() => {
      dialogRef.close();
    });

    // Se suscribe al evento personalizado onAddProduct emitido desde el diálogo
    // componentInstance = instancia del componente Product
    // onAddProduct = EventEmitter que está dentro de Product
    // .subscribe(...) = el padre se queda escuchando ese evento
    const sub = dialogRef.componentInstance.onAddProduct.subscribe((response) => {

      // Recarga los datos de la tabla después de agregar un producto
      //Refresca la tabla
      this.tableData();
    })

  }

  //Metodo para editar un producto 
  //values al hacer click envia todos los datos del producto seleccionado como id, name etc...
  handleEditAction(values: any) {

    //Creamos la configuracion del dialogo 
    const dialogConfig = new MatDialogConfig();
    //y enviamos la accion de Edit y el producto completo con sus datos al hijo dialogo
    dialogConfig.data = {
      action: 'Edit',
      data: values
    };

    // Define el ancho del diálogo
    dialogConfig.width = "850px"

    // Abre el diálogo usando el componente Product y la configuración definida
    //Se habre el componente Producto como un diaolog y se le pasa la accion Add y los datos del producto
    const dialogRef = this.dialog.open(Product, dialogConfig);
    this.router.events.subscribe(() => {
      dialogRef.close();
    });
    // Se suscribe al evento personalizado onAddProduct emitido desde el diálogo
    // componentInstance = instancia del componente Product
    // onEditProduct = EventEmitter que está dentro de Product
    // .subscribe(...) = el padre se queda escuchando ese evento
    const sub = dialogRef.componentInstance.onEditProduct.subscribe((response) => {
      //Refresca la tabla
      this.tableData();
    })

  }

  //Metodo para editar un producto 
  //values al hacer click envia todos los datos del producto seleccionado como id, name etc...
  //En este caso solo hacemos uso del id en this.deleteProduct(values.id);
  handleDeleteAction(values: any) {
    //Creamos la configuracion del dialogo 
    const dialogConfig = new MatDialogConfig();

    //Enviamos el message que se mostrara en el dialogo de Confirmation y enviamos confirmation
    dialogConfig.data = {
      message: 'eliminar el producto: ' + values.name,
      confirmation: true
    }

    const dialogRef = this.dialog.open(Confirmation, dialogConfig);
    const sub = dialogRef.componentInstance.onEmitStatusChange.subscribe((response) => {
      this.ngxService.start();
      this.deleteProduct(values.id);
      dialogRef.close();

    })
  }

  deleteProduct(id: any) {
    this.productService.delete(id).subscribe((response: any) => {
      this.ngxService.stop();
      this.tableData();
      this.responseMessage = response?.message;
      this.snackbarService.openSnackBar(this.responseMessage, 'Exito')
    }, (error) => {
      this.ngxService.stop();
      console.log(error.error?.message);
      if (error.error?.message) {
        this.responseMessage = error.error?.message;
      } else {
        this.responseMessage = GlobalConstants.genericErrorMessage;
      }
      this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error);
    })

  }

  onChange(status: any, id: any) {
    this.ngxService.start();

    var data = {
      status: status.toString(),
      id: id
    }

    this.productService.updateStatus(data).subscribe((response: any) => {
      this.ngxService.stop();
      this.tableData();
      this.responseMessage = response?.message;
      this.snackbarService.openSnackBar(this.responseMessage, 'Exito')
    }, (error) => {
      this.ngxService.stop();
      console.log(error.error?.message);
      if (error.error?.message) {
        this.responseMessage = error.error?.message;
      } else {
        this.responseMessage = GlobalConstants.genericErrorMessage;
      }
      this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error);
    })
  }

}
