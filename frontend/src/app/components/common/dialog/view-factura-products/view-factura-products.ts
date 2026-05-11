import { I } from '@angular/cdk/keycodes';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MATERIAL_IMPORTS } from '../../shared/material.imports';
import { COMMON_IMPORTS } from '../../shared/common.imports';

@Component({
  selector: 'app-view-factura-products',
  imports: [
    ...MATERIAL_IMPORTS,
    ...COMMON_IMPORTS
  ],
  templateUrl: './view-factura-products.html',
  styleUrl: './view-factura-products.scss',
})
export class ViewFacturaProducts implements OnInit {

  //Columnas que se mostraran en la tabla de productos de la factura
  displayColumns: string[] = ['name', 'category', 'price', 'quantity', 'total'];
  //Datasource de la tabla que se llenara con los productos de la factura
  dataSource: any = [];
  //Variable para almacenar los datos de la factura que se enviaran desde el componente padre
  data: any;

  constructor(
    //Inyeccion de datos desde el componente padre para mostrar los detalles de la factura
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    //Permite cerrar el dialogo despues de mostrar los detalles
    public dialogRef: MatDialogRef<ViewFacturaProducts>
  ) { }

  ngOnInit(): void {
    //Asigna los datos de la factura a la variable data 
    //y llena la datasource de la tabla con los productos de la factura
    this.data = this.dialogData.data;
    this.dataSource = JSON.parse(this.dialogData.data.productDetail);
    console.log(this.dialogData.data);
  }
}
