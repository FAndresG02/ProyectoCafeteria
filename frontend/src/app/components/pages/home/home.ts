import { Component, OnInit } from '@angular/core';
import { BestSeller } from "../best-seller/best-seller";
import { MatIcon } from "@angular/material/icon";
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { UserService } from '../../../services/user-service';
import { Router } from '@angular/router';
import { Signup } from '../../common/dialog/signup/signup';
import { ForgotPassword } from '../../common/dialog/forgot-password/forgot-password';
import { Login } from '../../common/dialog/login/login';

@Component({
  selector: 'app-home',
  imports: [BestSeller, MatIcon],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit {

  //MatDialog para abrir el diálogo de registro cuando el usuario haga clic en el botón de registro en la página de inicio  
  constructor(
    //Inyección de MatDialog para abrir diálogos modales
    private dialog: MatDialog,
    //Inyección de UserService para verificar el token del usuario al cargar la página de inicio
    private userService: UserService,
    //Inyección de Router para redirigir al usuario a otras páginas si es necesario
    private router: Router
  ) { }

  ngOnInit(): void {
    // Verificar el token del usuario al cargar la página de inicio y redirigir al dashboard si el token es válido
    this.userService.checkToken().subscribe((response:any) => {
      this.router.navigate(['/cafe/dashboard']);
    }, (error) => {
      // Si el token no es válido, no hacer nada y permitir que el usuario vea la página de inicio
      console.log('Token no válido o no presente' + error);
    });
  }

  // Lógica para manejar la acción de registro
  handleSignupAction() {
    // Aquí puedes abrir un diálogo de registro o redirigir a una página de registro
    const dialogConfig = new MatDialogConfig();
    // Configura el diálogo según tus necesidades
    dialogConfig.width = '400px';
    // dialogConfig.data = { /* datos que quieras pasar al diálogo */ };
    this.dialog.open(Signup, dialogConfig);
  }

  // Lógica para manejar la acción de olvido de contraseña
  handleForgotPasswordAction() {
    // Aquí puedes abrir un diálogo de olvido de contraseña o redirigir a una página de olvido de contraseña
    const dialogConfig = new MatDialogConfig();
    // Configura el diálogo según tus necesidades
    dialogConfig.width = '400px';
    // dialogConfig.data = { /* datos que quieras pasar al diálogo */ };
    this.dialog.open(ForgotPassword, dialogConfig);
  }

    // Lógica para manejar la acción de olvido de contraseña
  handleLoginAction() {
    // Aquí puedes abrir un diálogo de olvido de contraseña o redirigir a una página de olvido de contraseña
    const dialogConfig = new MatDialogConfig();
    // Configura el diálogo según tus necesidades
    dialogConfig.width = '400px';
    // dialogConfig.data = { /* datos que quieras pasar al diálogo */ };
    this.dialog.open(Login, dialogConfig);
  }
}