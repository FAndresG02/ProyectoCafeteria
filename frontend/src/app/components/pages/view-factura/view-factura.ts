import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Snackbar } from '../../../services/snackbar';
import { Router } from '@angular/router';
import { FacturaService } from '../../../services/factura-service';
import { GlobalConstants } from '../../common/shared/global-constants';
import { COMMON_IMPORTS } from '../../common/shared/common.imports';
import { MATERIAL_IMPORTS } from '../../common/shared/material.imports';
import { ViewFacturaProducts } from '../../common/dialog/view-factura-products/view-factura-products';
import { Confirmation } from '../../common/dialog/confirmation/confirmation';
import { saveAs } from 'file-saver';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-view-factura',
  imports: [
    ...MATERIAL_IMPORTS,
    ...COMMON_IMPORTS
  ],
  templateUrl: './view-factura.html',
  styleUrl: './view-factura.scss',
})
export class ViewFactura implements OnInit {

  displayColumns: string[] = ['name', 'email', 'contactNumber', 'paymentMethod', 'total', 'view'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  responseMessage: string = '';

  constructor(
    private cdr: ChangeDetectorRef,
    private facturaService: FacturaService,
    private ngxService: NgxUiLoaderService,
    private dialog: MatDialog,
    private snackbarService: Snackbar,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.ngxService.start();
    //Recarga la tabla de facturas al iniciar el componente
    this.tableData();
  }

  //Función para cargar los datos de las facturas en la tabla
  tableData() {
    //Llama al servicio para obtener las facturas y asigna la respuesta a la datasource de la tabla
    this.facturaService.getFacturas().subscribe((response: any) => {
      this.ngxService.stop();
      //Asigna la respuesta a la datasource [] de la tabla
      this.dataSource.data = response;
      this.cdr.detectChanges();
    }, (error) => {
      this.ngxService.stop();
      if (error.error?.message) {
        this.responseMessage = error.error?.message;
      } else {
        this.responseMessage = GlobalConstants.genericErrorMessage;
      }
      this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error);
    })
  }

  //Funcion para aplicar un filtro a la tabla de facturas
  applyFilter(event: Event) {
    //Obtiene el valor del filtro del input y lo asigna a la propiedad filter del datasource de la tabla, 
    //despues de eliminar los espacios en blanco y convertirlo a minusculas para mejorar la busqueda
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  //Función para manejar la acción de ver los detalles de una factura
  handleViewAction(value: any) {
    //Configura el dialog para mostrar los detalles de la factura seleccionada, 
    //pasando los datos de la factura al dialog
    const dialogConfig = new MatDialogConfig();
    //Asigna los datos de la factura seleccionada al dialogConfig.data para que puedan ser accedidos en el dialog
    dialogConfig.data = {
      data: value
    }
    // Configura el ancho del dialog para que ocupe el 100% del ancho de la pantalla
    dialogConfig.width = "2000px";
    //Abre el dialog con el componente ViewFacturaProducts y el dialogConfig configurado, 
    //y se suscribe a los eventos del router para cerrar el dialog cuando se navega a otra ruta
    const dialogRef = this.dialog.open(ViewFacturaProducts, dialogConfig);
    this.router.events.subscribe(() => {
      dialogRef.close();
    });
  }

  //Función para manejar la acción de eliminar una factura
  handleDeleteAction(value: any) {
    //Configura el dialog para confirmar la eliminación de la factura seleccionada,
    const dialogConfig = new MatDialogConfig();
    //Asigna un mensaje de confirmación al dialogConfig.data para que pueda ser mostrado en el dialog
    dialogConfig.data = {
      message: 'eliminar la factura: ' + value.name + ' ?',
      confirmation: true
    };

    //Abre el dialog con el componente Confirmation y el dialogConfig configurado,
    const dialogRef = this.dialog.open(Confirmation, dialogConfig);
    //Se suscribe al evento onEmitStatusChange del componente Confirmation para ejecutar 
    //la eliminación de la factura cuando se confirme la acción en el dialog
    const sub = dialogRef.componentInstance.onEmitStatusChange.subscribe((response: any) => {
      this.ngxService.start();
      this.deleteFactura(value.id);
      dialogRef.close();
    });
  }

  //Función para eliminar una factura llamando al servicio de factura y manejando 
  //la respuesta para mostrar un mensaje de éxito o error
  deleteFactura(id: any) {
    this.facturaService.deleteFactura(id).subscribe((response: any) => {
      this.ngxService.stop();
      //Recarga la tabla de facturas después de eliminar una factura para reflejar los cambios
      this.tableData();
      this.responseMessage = response?.message;
      this.snackbarService.openSnackBar(this.responseMessage, "success");
    }, (error) => {
      this.ngxService.stop();
      if (error.error?.message) {
        this.responseMessage = error.error?.message;
      } else {
        this.responseMessage = GlobalConstants.genericErrorMessage;
      }
      this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error);
    });
  }


  //Función para manejar la acción de descargar el reporte de una factura
  dowloadReportAction(values: any) {
    this.ngxService.start();
    //Crea un objeto data con los datos necesarios para generar el reporte de la orden,
    var data = {
      name: values.name,
      email: values.email,
      uuid: values.uuid,
      contactNumber: values.contactNumber,
      paymentMethod: values.paymentMethod,
      totalAmount: values.total.toString(),
      productDetails: values.productDetails
    }

    //Llama al servicio de factura para generar el reporte de la orden, pasando el objeto data como parámetro,
    this.dowloadFile(values.uuid, data);
  }

  //Función para descargar el reporte de una factura llamando al servicio de factura y 
  //manejando la respuesta para guardar el archivo PDF o mostrar un mensaje de error
  dowloadFile(fileName: any, data: any) {
    this.facturaService.getPdf(data).subscribe((response: any) => {
      //Utiliza la función saveAs de la librería file-saver 
      //para guardar el archivo PDF con el nombre especificado
      saveAs(response, fileName + '.pdf');
      this.ngxService.stop();
    }, (error) => {
      this.ngxService.stop();
      if (error.error?.message) {
        this.responseMessage = error.error?.message;
      } else {
        this.responseMessage = GlobalConstants.genericErrorMessage;
      }
      this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error);
    });
  }

}
