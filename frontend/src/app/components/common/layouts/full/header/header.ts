import { Component } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { COMMON_IMPORTS } from '../../../shared/common.imports';
import { MATERIAL_IMPORTS } from '../../../shared/material.imports';
import { Confirmation } from '../../../dialog/confirmation/confirmation';
import { ChangePassword } from '../../../dialog/change-password/change-password';

@Component({
  selector: 'app-header',
  imports: [
    ...COMMON_IMPORTS,
    ...MATERIAL_IMPORTS
  ],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {

  // definir el rol del usuario para mostrar opciones en el header
  role: any;

  constructor(
    // inyectar el router para redirigir al usuario a la pagina de login despues de cerrar sesion
    private router: Router,
    // inyectar el dialog para mostrar el dialog de confirmacion al cerrar sesion y el dialog de cambio de contraseña
    private dialog: MatDialog
  ) { }

  // definir el metodo de logout para cerrar sesion, 
  // mostrar el dialog de confirmacion y 
  // redirigir al usuario a la pagina de login despues de cerrar sesion
  logout() {

    // configurar el dialog de confirmacion para mostrar el titulo y el mensaje de confirmacion
    const dialogConfig = new MatDialogConfig();

    // 1. Configura qué datos le va a mandar al hijo
    // configurar el dialog para mostrar el titulo y el mensaje de confirmacion
    dialogConfig.data = {
      title: 'Cerrar Sesion',
      confirmation: true,
      message: 'cerrar sesión'
    };

    // 2. Abre el dialog (crea el hijo)
    // abrir el dialog de confirmacion y suscribirse al evento de cambio de estado para cerrar sesion 
    const dialogRef = this.dialog.open(Confirmation, dialogConfig);

    // 3. Se suscribe al evento del hijo para saber qué pasó
    // suscribirse al evento de cambio de estado para cerrar sesion
    const sub = dialogRef.componentInstance.onEmitStatusChange.subscribe((reponse) => {
      // si la respuesta es true, cerrar sesion y redirigir al usuario a la pagina de login despues de cerrar sesion
      if (reponse) {
        dialogRef.close();
        localStorage.clear();
        this.router.navigate(['/']);
      }
    });
  }

  // definir el metodo de changePassword para mostrar el dialog de cambio de contraseña
  changePassword() {
    // configurar el dialog de cambio de contraseña para mostrar el dialog con un ancho de 550px
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '550px';
    // abrir el dialog de cambio de contraseña
    this.dialog.open(ChangePassword, dialogConfig);
  }



}
