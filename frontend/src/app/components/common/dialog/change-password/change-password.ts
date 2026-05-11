import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../../../services/user-service';
import { MatDialogRef} from '@angular/material/dialog';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Snackbar } from '../../../../services/snackbar';
import { GlobalConstants } from '../../shared/global-constants';
import { MATERIAL_IMPORTS } from '../../shared/material.imports';
import { COMMON_IMPORTS } from '../../shared/common.imports';

@Component({
  selector: 'app-change-password',
  imports: [
    ...MATERIAL_IMPORTS,
    ...COMMON_IMPORTS
  ],
  templateUrl: './change-password.html',
  styleUrl: './change-password.scss',
})
export class ChangePassword implements OnInit {

  oldPassword = true;
  newPassword = true;
  confirmPassword = true;
  changePasswordForm: any = FormGroup;
  responseMessage: any;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    public dialogRef: MatDialogRef<ChangePassword>,
    private ngxService: NgxUiLoaderService,
    private snackbarService: Snackbar
  ) { }

  ngOnInit(): void {

    this.changePasswordForm = this.formBuilder.group({
      oldPassword: [null, Validators.required],
      newPassword: [null, Validators.required],
      confirmPassword: [null, Validators.required]
    })

  }

  validateSubmit() {
    const newPass = this.changePasswordForm.controls['newPassword'].value;
    const confirmPass = this.changePasswordForm.controls['confirmPassword'].value;

    return newPass && confirmPass && newPass !== confirmPass;
  }

  handlePasswordChange() {

    //Empieza el sping de carga
    this.ngxService.start();

    //obtener los valores del formulario 
    var formData = this.changePasswordForm.value;
    //construinos el objeto con los datos extraidos del formulario para mandar al backend
    var data = {
      oldPassword: formData.oldPassword,
      newPassword: formData.newPassword,
      confirmPassword: formData.confirmPassword
    }

    //nos subscribimos al metodo defino en el backend mediante el servicio userService
    this.userService.changePassword(data).subscribe((response: any) => {

      //detenemos el spin de carga 
      this.ngxService.stop();
      //obtenemos el mensaje de respuesta del backend
      this.responseMessage = response?.message;
      //mostramos el mensaje de respuesta al usuario 
      this.snackbarService.openSnackBar(this.responseMessage, "success")
      //cerramos el dialogo despues de mostrar
      this.dialogRef.close();

    }, (error) => {

      //imprimimos el erro en consola
      console.log(error);
      //detenemos el sping de carga
      this.ngxService.stop();

      //si la respuesta del backend dio un error
      if (error.error?.message) {
        //asignamos responseMessage este error
        this.responseMessage = error.error?.message;
      } else {
        //si no es asi el responseMessage se le asigna un mensaje generico 
        this.responseMessage = GlobalConstants.genericErrorMessage;
      }

      //segun el if se imprime segun la respuesta que se asgino a responseMessage e imprime una constante de error 
      this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error);

    })

  }


}
