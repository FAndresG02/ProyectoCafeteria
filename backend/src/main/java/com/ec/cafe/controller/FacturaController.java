package com.ec.cafe.controller;

import com.ec.cafe.config.CafeConstants;
import com.ec.cafe.entity.FacturaEntity;
import com.ec.cafe.service.FacturaService;
import com.ec.cafe.utils.CafeUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping(path = "/factura")
public class FacturaController {

    @Autowired
    FacturaService facturaService;

    //Metodo para generar un Reporte
    @PostMapping(path = "/generateReport")
    public ResponseEntity<String> generateReport(@RequestBody Map<String, Object> requestMap){

        try {

            return facturaService.generateReport(requestMap);

        }catch (Exception e){
            System.out.println(e.getMessage());
            e.printStackTrace();
        }

        return CafeUtils.getResponseEntity(CafeConstants.SOMETHING_WENT_WRONG, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    //Metodo para obtener todos las facturas
    @GetMapping(path = "/getFacturas")
    public ResponseEntity<List<FacturaEntity>> getFacturas(){

        try {

            return facturaService.getFacturas();

        }catch (Exception e){
            System.out.println(e.getMessage());
            e.printStackTrace();
        }

        return new ResponseEntity<>(new ArrayList<>(), HttpStatus.INTERNAL_SERVER_ERROR);
    }

    //Metodo para obtener el pdf
    @PostMapping(path = "/getPdf")
    public ResponseEntity<byte[]> getPdf(@RequestBody Map<String, Object> requestMap){
        try {

            return facturaService.getPdf(requestMap);

        }catch (Exception e){
            System.out.println(e.getMessage());
            e.printStackTrace();
        }

        return new ResponseEntity<>(new byte[0], HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @DeleteMapping(path = "/delete/{id}")
    public ResponseEntity<String> deleteFactura(@PathVariable("id") Integer id){

        try {

            return facturaService.deleteFactura(id);

        }catch (Exception e){
            System.out.println(e.getMessage());
            e.printStackTrace();
        }
        return new ResponseEntity<>(CafeConstants.SOMETHING_WENT_WRONG, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
