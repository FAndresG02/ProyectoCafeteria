package com.ec.cafe.controller;

import com.ec.cafe.config.CafeConstants;
import com.ec.cafe.entity.CategoryEntity;
import com.ec.cafe.service.CategoryService;
import com.ec.cafe.utils.CafeUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping(path = "/category")
public class CategoryController {

    @Autowired
    CategoryService categoryService;

    //Metodo para añadir una nueva categoria
    //@RequestBody Se usa cuando los datos vienen en el cuerpo (body) de la petición.
    @PostMapping(path = "/add")
    ResponseEntity<String> addNewCategory(@RequestBody(required = true) Map<String, String> requestMap){

        try {

            return categoryService.addNewCategory(requestMap);

        }catch (Exception e){
            System.out.println(e.getMessage());
            e.printStackTrace();
        }

        //Metodo para construir la respuesta si algo salio mal
        return CafeUtils.getResponseEntity(CafeConstants.SOMETHING_WENT_WRONG, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    //Metodo para obtener todas las categorias
    //@RequestParam Se usa cuando los datos vienen en la URL como parámetros.
    @GetMapping(path = "/get")
    ResponseEntity<List<CategoryEntity>> getAllCategory(@RequestParam(required = false) String filterValue){
        try {

            return categoryService.getAllCategory(filterValue);

        }catch (Exception e){
            System.out.println(e.getMessage());
            e.printStackTrace();
        }

        //Metodo para construir la respuesta si algo salio mal
        return new ResponseEntity<>(new ArrayList<>(), HttpStatus.INTERNAL_SERVER_ERROR);
    }

    //Metodo para actualizar las categorias
    @PostMapping(path = "/update")
    public ResponseEntity<String> updateCategory(@RequestBody(required = true) Map<String, String> requestMap){

        try {

            return categoryService.updateCategory(requestMap);

        }catch (Exception e){
            System.out.println(e.getMessage());
            e.printStackTrace();
        }

        return CafeUtils.getResponseEntity(CafeConstants.SOMETHING_WENT_WRONG, HttpStatus.INTERNAL_SERVER_ERROR);
    }


}
