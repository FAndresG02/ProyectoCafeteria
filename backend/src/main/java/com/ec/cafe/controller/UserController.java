package com.ec.cafe.controller;

import com.ec.cafe.config.CafeConstants;
import com.ec.cafe.dto.UserDto;
import com.ec.cafe.service.UserService;
import com.ec.cafe.utils.CafeUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Controlador REST encargado de manejar las peticiones relacionadas con usuarios.
 *
 * La anotación @RestController indica que esta clase manejará solicitudes HTTP
 * y devolverá respuestas en formato JSON automáticamente.
 *
 * La anotación @RequestMapping(path = "/user") define la ruta base para
 * todas las peticiones de este controlador.
 *
 * Ejemplo de ruta completa:
 * POST /user/signup
 */
@RestController
@RequestMapping(path = "/user")
public class UserController {

    /**
     * Inyección de dependencia del servicio de usuario.
     *
     * @Autowired permite que Spring inyecte automáticamente
     * la implementación de UserService.
     */
    @Autowired
    UserService userService;


    /**
     * Endpoint para registrar un nuevo usuario.
     *
     * @PostMapping(path = "/signup") indica que este metodo
     * responde a peticiones HTTP POST en la ruta:
     * /user/signup
     *
     * @param requestMap Contiene los datos enviados en el cuerpo
     *                   de la petición en formato JSON.
     *                   Se recibe como un Map<String, String>.
     *
     * @return ResponseEntity<String> con el resultado del registro.
     *         Puede devolver éxito o un mensaje de error.
     *
     * Funcionamiento:
     * 1. Recibe los datos del usuario.
     * 2. Llama al metodo signUp del servicio.
     * 3. Si ocurre una excepción, captura el error.
     * 4. Devuelve un mensaje genérico usando cafeUtils.
     */
    @PostMapping(path = "/signup")
    public ResponseEntity<String> signUp(@RequestBody(required = true) Map<String, String> requestMap){

        try {

            return userService.signUp(requestMap);

        }catch (Exception ex){
            ex.printStackTrace();
        }

        //Metodo para construir la respuesta si algo salio mal
        return CafeUtils.getResponseEntity(CafeConstants.SOMETHING_WENT_WRONG, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @PostMapping(path = "/login")
    public ResponseEntity<?> login(@RequestBody(required = true) Map<String, String> requestMap){
        try {

            return userService.login(requestMap);

        }catch (Exception e){
            e.printStackTrace();
        }

        //Metodo para construir la respuesta si algo salio mal
        return CafeUtils.getResponseEntity(CafeConstants.SOMETHING_WENT_WRONG, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    //Metodo para obtener todos los usuarios
    @GetMapping(path = "/get")
    //devuelve una lista de usuarios dto estos usuarios tienen campos especificos
    public ResponseEntity<List<UserDto>> getAllUser(){
        try {

            return userService.getAllUser();

        }catch (Exception e){
            e.printStackTrace();
        }

        return new ResponseEntity<List<UserDto>>(new ArrayList<>(), HttpStatus.INTERNAL_SERVER_ERROR);
    }


    @PostMapping(path = "/update")
    public ResponseEntity<String> update(@RequestBody(required = true) Map<String, String> requestMap){

        try {

            return userService.update(requestMap);

        }catch (Exception e){
            e.printStackTrace();
        }

        return CafeUtils.getResponseEntity(CafeConstants.SOMETHING_WENT_WRONG, HttpStatus.INTERNAL_SERVER_ERROR);

    }

    //Peticion get para obtener y comprobar el token
    @GetMapping(path = "/checkToken")
    public ResponseEntity<String> checkToken(){
        try {

            return userService.checkToken();

        }catch (Exception e){
            System.out.println(e.getMessage());
            e.printStackTrace();
        }

        return CafeUtils.getResponseEntity(CafeConstants.SOMETHING_WENT_WRONG, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    //Peticion post para cambiar la contraseña
    @PostMapping(path = "/changePassword")
    public ResponseEntity<String> changePassword(@RequestBody Map<String, String> requestMap){

        try {

            return userService.changePassword(requestMap);

        }catch (Exception e){
            System.out.println(e.getMessage());
            e.printStackTrace();
        }

        return CafeUtils.getResponseEntity(CafeConstants.SOMETHING_WENT_WRONG, HttpStatus.INTERNAL_SERVER_ERROR);

    }

    //Metodo para recuperar contraseña
    @PostMapping(path = "/forgotPassword")
    public ResponseEntity<String> forgotPassword(@RequestBody Map<String, String> requestMap){

        try {

            return userService.forgotPassword(requestMap);

        }catch (Exception e){
            System.out.println(e.getMessage());
            e.printStackTrace();
        }

        return CafeUtils.getResponseEntity(CafeConstants.SOMETHING_WENT_WRONG, HttpStatus.INTERNAL_SERVER_ERROR);
    }




}
