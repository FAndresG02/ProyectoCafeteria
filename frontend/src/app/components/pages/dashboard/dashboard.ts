import { AfterViewInit, ChangeDetectorRef, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DashboardService } from '../../../services/dashboard-service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Snackbar } from '../../../services/snackbar';
import { GlobalConstants } from '../../common/shared/global-constants';
import { MATERIAL_IMPORTS } from '../../common/shared/material.imports';
import { COMMON_IMPORTS } from '../../common/shared/common.imports';

@Component({
  selector: 'app-dashboard',
  imports: [
    ...MATERIAL_IMPORTS,
    ...COMMON_IMPORTS
],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements AfterViewInit{

  // Mensaje de respuesta del backend
  responseMessage: any;
  // Datos obtenidos del backend para mostrar en el dashboard
  data: any;

  ngAfterViewInit(): void {}

  constructor(
    private cdr: ChangeDetectorRef,
    // Inyección del router para redirigir al usuario a otras páginas
    private router: RouterModule,
    // Inyección del servicio de dashboard para obtener los detalles del usuario
    private dashboardService: DashboardService,
    // Inyección del servicio de ngx-ui-loader para mostrar un spinner de carga
    private ngxService: NgxUiLoaderService,
    // Inyección del servicio de snackbar para mostrar mensajes al usuario
    private snackbarService: Snackbar
  ) { 

    // Inicia el spinner de carga al cargar el componente
    this.ngxService.start();
    // Llama a la función para obtener los datos del dashboard
    this.dashboardData();
   }

   // Función para obtener los datos del dashboard desde el backend
   dashboardData() {

    // Llama al servicio de dashboard para obtener los detalles del usuario
    this.dashboardService.getDetails().subscribe((response: any) => {

      // Detiene el spinner de carga después de recibir la respuesta
      this.ngxService.stop();
      // Asigna los datos recibidos a la variable 'data' para mostrarlos en el dashboard
      this.data = response;

      this.cdr.detectChanges();
      console.log(this.data);
    }, (error: any) => {

      // Detiene el spinner de carga en caso de error
      this.ngxService.stop();
      // Maneja el error y muestra un mensaje de error al usuario
      console.log(error);
      // Si el error tiene un mensaje específico, úsalo; de lo contrario, muestra un mensaje genérico
      if (error.error?.message) {
        // Asigna el mensaje de error específico a la variable 'responseMessage'
        this.responseMessage = error.error?.message;
      } else {
        // Asigna un mensaje de error genérico a la variable 'responseMessage'
        this.responseMessage = GlobalConstants.genericErrorMessage;
      }
      // Muestra el mensaje de error al usuario utilizando el servicio de snackbar
      this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error);

    });
   }
}
