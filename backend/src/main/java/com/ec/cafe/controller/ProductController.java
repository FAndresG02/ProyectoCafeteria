package com.ec.cafe.controller;

import com.ec.cafe.config.CafeConstants;
import com.ec.cafe.dto.ProductDto;
import com.ec.cafe.service.ProductService;
import com.ec.cafe.utils.CafeUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping(path = "/product")
public class ProductController {

    @Autowired
    ProductService productService;

    @PostMapping(path = "/add")
    ResponseEntity<String> addNewProduct(@RequestBody(required = true) Map<String, String> requesMap){

        try {

            return productService.addNewProduct(requesMap);

        }catch (Exception e){
            System.out.println(e.getMessage());
            e.printStackTrace();
        }

        return CafeUtils.getResponseEntity(CafeConstants.SOMETHING_WENT_WRONG, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    //Metodo para obtener los productos segun un dto de producto
    @GetMapping(path = "/get")
    ResponseEntity<List<ProductDto>> getAllProduct(){

        try {

            return productService.getAllProduct();

        }catch (Exception e){
            System.out.println(e.getMessage());
            e.printStackTrace();
        }

        return new ResponseEntity<> (new ArrayList<>(), HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @PostMapping(path = "/update")
    public ResponseEntity<String> updateProduct(@RequestBody(required = true) Map<String, String> requesMap){

        try {

            return productService.updateProduct(requesMap);

        }catch (Exception e){
            System.out.println(e.getMessage());
            e.printStackTrace();
        }

        return CafeUtils.getResponseEntity(CafeConstants.SOMETHING_WENT_WRONG, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @DeleteMapping(path = "/delete/{id}")
    public ResponseEntity<String> deleteProduct(@PathVariable Integer id){

        try {

            return productService.deleteProduct(id);

        }catch (Exception e){
            System.out.println(e.getMessage());
            e.printStackTrace();
        }

        return CafeUtils.getResponseEntity(CafeConstants.SOMETHING_WENT_WRONG, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    //Metodo para actualizar el status
    @PostMapping(path = "/updateStatus")
    public ResponseEntity<String> updateStatus(@RequestBody(required = true) Map<String, String> requesMap){
        try {

            return productService.updateStatus(requesMap);

        }catch (Exception e){
            System.out.println(e.getMessage());
            e.printStackTrace();
        }

        return CafeUtils.getResponseEntity(CafeConstants.SOMETHING_WENT_WRONG, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @GetMapping(path = "/getByCategory/{id}")
    public ResponseEntity<List<ProductDto>> getByCategory(@PathVariable Integer id){

        try {

            return productService.getByCategory(id);

        }catch (Exception e){
            System.out.println(e.getMessage());
            e.printStackTrace();
        }

        return new ResponseEntity<> (new ArrayList<>(), HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @GetMapping(path = "/getProductById/{id}")
    public ResponseEntity<ProductDto> getProductById(@PathVariable Integer id){
        try {

            return productService.getProductById(id);

        }catch (Exception e){
            System.out.println(e.getMessage());
            e.printStackTrace();
        }

        return new ResponseEntity<>(new ProductDto(), HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
