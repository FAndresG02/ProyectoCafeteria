import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialogRef } from '@angular/material/dialog';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { MATERIAL_IMPORTS } from '../../shared/material.imports';
import { COMMON_IMPORTS } from '../../shared/common.imports';
import { UserService } from '../../../../services/user-service';
import { Snackbar } from '../../../../services/snackbar';
import { GlobalConstants } from '../../shared/global-constants';


@Component({
  selector: 'app-login',
  imports: [
    ...MATERIAL_IMPORTS,
    ...COMMON_IMPORTS
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {

  // Controla si la contraseña se muestra u oculta
  password: boolean = true;
  // Formulario reactivo (CORREGIDO)
  loginForm!: FormGroup;
  // Mensaje de respuesta del backend
  responseMessage: any;

  constructor(
    // Inyección de dependencias para el formulario
    private formBuilder: FormBuilder,
    // Inyección del router para redirigir al usuario después del login
    private router: Router,
    // Inyección del servicio de usuario para manejar la lógica de login
    private userService: UserService,
    // Inyección del servicio de diálogo para cerrar el diálogo después del login
    public dialogRef: MatDialogRef<Login>,
    // Inyección del servicio de ngx-ui-loader para mostrar un spinner de carga
    private ngxService: NgxUiLoaderService,
    // Inyección del servicio de snackbar para mostrar mensajes al usuario
    private snackbarService: Snackbar
  ) { }

  ngOnInit(): void {

    // Inicialización del formulario con validaciones
    this.loginForm = this.formBuilder.group({
      // Email (MEJOR usar Validators.email)
      email: [null, [
        Validators.required,
        Validators.email
      ]],
      // Contraseña (MEJOR usar Validators.minLength)
      password: [null, [
        Validators.required
      ]]

    });
  }

 // Método para manejar el envío del formulario de login
  handleSubmit() {
    // Iniciar el spinner de carga
    this.ngxService.start();

    // Obtener los datos del formulario
    var rest = this.loginForm.value;

    // Crear el objeto de datos para enviar al backend
    var formData = {
      email: rest.email,
      password: rest.password
    }

    this.userService.login(formData).subscribe((response: any) => {
      // Detener el spinner de carga
      this.ngxService.stop();
      // Guardar el token en el localStorage
      localStorage.setItem('token', response?.token);
      // Redirigir al usuario al dashboard después del login exitoso
      this.router.navigate(['/cafe/dashboard']);
      // Obtener el mensaje de respuesta del backend
      this.responseMessage = response?.message;
      console.log(this.responseMessage);
      this.snackbarService.openSnackBar(this.responseMessage, "Sesion iniciada exitosamente");
      this.dialogRef.close();

    }, (error) => {
      // Detener el spinner de carga
      this.ngxService.stop();
      // Obtener el mensaje de error del backend
      if (error.error?.message) {
        // Mostrar el mensaje de error al usuario
        this.responseMessage = error.error?.message;
      } else {
        // Mostrar un mensaje de error genérico al usuario
        this.responseMessage = GlobalConstants.genericErrorMessage;
      }
      // Mostrar el mensaje de error al usuario
      this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error);
    });
  }
}
