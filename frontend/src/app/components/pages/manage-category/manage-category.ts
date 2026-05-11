import { Component, OnInit } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CategoryService } from '../../../services/category-service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Snackbar } from '../../../services/snackbar';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MATERIAL_IMPORTS } from '../../common/shared/material.imports';
import { COMMON_IMPORTS } from '../../common/shared/common.imports';
import { GlobalConstants } from '../../common/shared/global-constants';
import { Category } from '../../common/dialog/category/category';

@Component({
  selector: 'app-manage-category',
  imports: [
    ...MATERIAL_IMPORTS,
    ...COMMON_IMPORTS
  ],
  templateUrl: './manage-category.html',
  styleUrl: './manage-category.scss',
})
export class ManageCategory implements OnInit {

  displayColumns: String[] = ['name', 'edit'];
  dataSource = new MatTableDataSource<any>([]);
  responseMessage: any;

  constructor(
    //Inyecta los servicios definos en CategoryService
    private categoryService: CategoryService,
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

  //Metodo para extraer las categorias 
  tableData() {

    //Nos subcribirmos para extraer las cateogirias y nos dara un respuesta (response)
    //response es un array de objetos que viene del backend 
    this.categoryService.get().subscribe((response: any) => {
      //Se deteniene el sping de carga
      this.ngxService.stop();
      //convierte ese array en una fuente de datos compatible con mat-table.
      this.dataSource.data = response;
    }, (error: any) => {

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

    // Abre el diálogo usando el componente Category y la configuración definida
    //Se habre el componente Producto como un diaolog y se le pasa la accion Add
    const dialogRef = this.dialog.open(Category, dialogConfig);

    // Se suscribe a los cambios de ruta para cerrar el diálogo automáticamente si se navega
    this.router.events.subscribe(() => {
      dialogRef.close();
    });

    // Se suscribe al evento personalizado onAddCategory emitido desde el diálogo
    // componentInstance = instancia del componente Product
    // onAddProduct = EventEmitter que está dentro de Product
    // .subscribe(...) = el padre se queda escuchando ese evento
    const sub = dialogRef.componentInstance.onAddCategory.subscribe((response) => {
      // Recarga los datos de la tabla después de agregar un producto
      //Refresca la tabla
      this.tableData();
    })

  }

  handleEditAction(values: any) {

    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      action: 'Edit',
      data: values
    };

    dialogConfig.width = "850px"
    const dialogRef = this.dialog.open(Category, dialogConfig);
    this.router.events.subscribe(() => {
      dialogRef.close();
    });
    const sub = dialogRef.componentInstance.onEditCategory.subscribe((response) => {
      this.tableData();
    })
  }

}
