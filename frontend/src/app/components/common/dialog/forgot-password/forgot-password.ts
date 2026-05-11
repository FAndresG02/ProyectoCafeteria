import { Component } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { COMMON_IMPORTS } from '../../shared/common.imports';
import { MATERIAL_IMPORTS } from '../../shared/material.imports';
import { UserService } from '../../../../services/user-service';
import { Snackbar } from '../../../../services/snackbar';
import { GlobalConstants } from '../../shared/global-constants';

@Component({
  selector: 'app-forgot-password',
  imports: [
    ...COMMON_IMPORTS,
    ...MATERIAL_IMPORTS
  ],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.scss',
})
export class ForgotPassword {

  // Formulario reactivo para la recuperación de contraseña
  forgotPasswordForm!: FormGroup;

  // Mensaje de respuesta del backend
  responseMessage: any;

  constructor(
    // Inyección de dependencias para el formulario
    private formBuilder: FormBuilder,
    // Inyección del servicio de usuario para manejar la lógica de recuperación de contraseña
    private userService: UserService,
    // Inyección del servicio de snackbar para mostrar mensajes al usuario
    public dialogRef: MatDialogRef<ForgotPassword>,
    // Inyección del servicio de snackbar para mostrar mensajes al usuario
    private snackbarService: Snackbar,
    // Inyección del servicio de ngx-ui-loader para mostrar un spinner de carga
    private ngxService: NgxUiLoaderService
  ) { }

  ngOnInit(): void {
    // Inicialización del formulario con validaciones
    this.forgotPasswordForm = this.formBuilder.group({

      // Email (MEJOR usar Validators.email)
      email: [null, [
        Validators.required,
        Validators.email
      ]]
    });
  }

  handleSubmit() {

    this.ngxService.start(); // Iniciar el spinner de carga

    // Obtener los datos del formulario
    var rest = this.forgotPasswordForm.value;

    // Crear el objeto de datos para enviar al backend
    var formData = {
      email: rest.email
    }

    // Enviar la solicitud de recuperación de contraseña al backend
    this.userService.forgotPassword(formData).subscribe((response: any) => {
      this.ngxService.stop(); // Detener el spinner de carga

      // Obtener el mensaje de respuesta del backend
      this.responseMessage = response?.message;
      // Mostrar el mensaje de respuesta al usuario
      this.snackbarService.openSnackBar(this.responseMessage, "Cerrar");
      // Cerrar el diálogo después de mostrar el mensaje
      this.dialogRef.close();

    }, (error) => {
      // Obtener el mensaje de error del backend
      if (error.error?.message) {
        // Mostrar el mensaje de error al usuario
        this.responseMessage = error.error?.message;
      } else {
        // Mostrar un mensaje de error genérico al usuario
        this.responseMessage = "Error al enviar el correo de recuperación";
      }
      // Mostrar el mensaje de error al usuario
      this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error);
    });
  }

}
