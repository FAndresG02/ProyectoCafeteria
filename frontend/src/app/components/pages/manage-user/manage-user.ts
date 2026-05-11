import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { UserService } from '../../../services/user-service';
import { Snackbar } from '../../../services/snackbar';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { GlobalConstants } from '../../common/shared/global-constants';
import { MATERIAL_IMPORTS } from '../../common/shared/material.imports';
import { COMMON_IMPORTS } from '../../common/shared/common.imports';

@Component({
  selector: 'app-manage-user',
  imports: [
    ...MATERIAL_IMPORTS,
    ...COMMON_IMPORTS
  ],
  templateUrl: './manage-user.html',
  styleUrl: './manage-user.scss',
})
export class ManageUser implements OnInit {

  displayColumns: String[] = ['name', 'email', 'contactNumber', 'status'];
  dataSource = new MatTableDataSource<any>([]);
  responseMessage: any;

  constructor(
    private cdr: ChangeDetectorRef,
    private ngxService: NgxUiLoaderService,
    private userSErvice: UserService,
    private snackbarService: Snackbar
  ) { }

  ngOnInit(): void {
    this.ngxService.start();
    this.tableData();
  }

  tableData() {
    this.userSErvice.getUsers().subscribe((response: any) => {
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

  //Metodo para cambiar el estado del usuario
  onChange(status: any, id: any) {  
    this.ngxService.start();
    var data = {
      status: status.toString(),
      id: id
    }

    this.userSErvice.update(data).subscribe((response: any) => {
      this.ngxService.stop();
      this.responseMessage = response?.message;
      this.snackbarService.openSnackBar(this.responseMessage, "success");

    }, (error) => {
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
}
