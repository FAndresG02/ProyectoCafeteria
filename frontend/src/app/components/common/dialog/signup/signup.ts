import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialogRef } from '@angular/material/dialog';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { MATERIAL_IMPORTS } from '../../shared/material.imports';
import { COMMON_IMPORTS } from '../../shared/common.imports';
import { UserService } from '../../../../services/user-service';
import { Snackbar } from '../../../../services/snackbar';
import { GlobalConstants } from '../../shared/global-constants';
import { UserInterface } from '../../../../interface/user-interface';

@Component({
  selector: 'app-signup',
  imports: [
    ...COMMON_IMPORTS,
    ...MATERIAL_IMPORTS
  ],
  templateUrl: './signup.html',
  styleUrl: './signup.scss',
})
export class Signup implements OnInit {

  // Controla si la contraseña se muestra u oculta
  password: boolean = true;

  // Controla si la confirmación de contraseña se muestra u oculta
  confirmPassword: boolean = true;

  // Formulario reactivo (CORREGIDO)
  signupForm!: FormGroup;

  // Mensaje de respuesta del backend
  responseMessage: any;

  constructor(
    // Inyección de dependencias para el formulario
    private formBuilder: FormBuilder,
    // Inyección del router para redirigir al usuario después del registro
    private router: Router,
    // Inyección del servicio de usuario para manejar la lógica de registro
    private userService: UserService,
    // Inyección del servicio de snackbar para mostrar mensajes al usuario
    private snackbarService: Snackbar,
    // Inyección del servicio de diálogo para cerrar el diálogo después del registro
    public dialogRef: MatDialogRef<Signup>,
    // Inyección del servicio de ngx-ui-loader para mostrar un spinner de carga
    private ngxService: NgxUiLoaderService
  ) { }

  ngOnInit(): void {

    // Inicialización del formulario con validaciones
    this.signupForm = this.formBuilder.group({

      // Nombre (solo letras y números)
      name: [null, [
        Validators.required,
        Validators.pattern(GlobalConstants.nameRegex)
      ]],

      // Email (MEJOR usar Validators.email)
      email: [null, [
        Validators.required,
        Validators.email
      ]],

      // Número de contacto (10 dígitos)
      contactNumber: [null, [
        Validators.required,
        Validators.pattern(GlobalConstants.contactNumberRegex)
      ]],

      // Contraseña
      password: [null, [Validators.required]],

      // Confirmación de contraseña
      confirmPassword: [null, [Validators.required]]
    });
  }

  // Verifica si las contraseñas coinciden
  validateSubmit() {
    let password = this.signupForm.value.password;
    let confirmPassword = this.signupForm.value.confirmPassword;

    if (password != confirmPassword) {
      return true;
    } else {
      return false;
    }
  }

  // Método que se ejecuta al enviar el formulario
  handleSubmit() {
    this.ngxService.start(); // Iniciar el spinner de carga

    // Si el formulario es inválido o las contraseñas no coinciden, no hace nada
    if (this.signupForm.invalid || this.validateSubmit()) {
      this.ngxService.stop(); // Detener el spinner de carga
      return;
    }

    // Obtenemos los datos del formulario signupForm excluyendo confirmPassword
    const { confirmPassword, ...rest } = this.signupForm.value;

    // Creamos un objeto con los datos necesarios para el backend
    const formData: UserInterface = {
      name: rest.name,
      email: rest.email,
      contactNumber: rest.contactNumber,
      password: rest.password
    };

    // Llamada al servicio
    this.userService.signup(formData).subscribe(
      // Éxito
      (response: any) => {
        // Detener el spinner de carga
        this.ngxService.stop();
        // Cerrar el diálogo después de mostrar el mensaje
        this.dialogRef.close();
        // Obtener el mensaje de respuesta del backend
        this.responseMessage = response?.message;
        // Mostrar el mensaje de éxito al usuario
        console.log(this.responseMessage);
        this.snackbarService.openSnackBar(this.responseMessage, "success");
        // Redirigir al usuario a la página de inicio de sesión después del registro exitoso
        this.router.navigate(['/']);
      },
      // Error
      (error) => {
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
        this.snackbarService.openSnackBar(this.responseMessage, "error");
      }
    );
  }
}