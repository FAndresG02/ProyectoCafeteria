package com.ec.cafe.service;

import com.ec.cafe.config.CafeConstants;
import com.ec.cafe.dto.UserDto;
import com.ec.cafe.response.AuthResponse;
import com.ec.cafe.entity.UserEntity;
import com.ec.cafe.repository.UserRepository;
import com.ec.cafe.security.CustomerUsersDetailsService;
import com.ec.cafe.security.JwtAuthenticationFilter;
import com.ec.cafe.security.JwtUtil;
import com.ec.cafe.utils.CafeUtils;
import com.ec.cafe.utils.EmailUtils;
import com.google.common.base.Strings;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.*;

@Slf4j
@Service
public class UserService {

    @Autowired
    UserRepository userRepository;

    //configuracion del jwt
    @Autowired
    AuthenticationManager authenticationManager;
    @Autowired
    CustomerUsersDetailsService customerUsersDetailsService;
    @Autowired
    JwtUtil jwtUtil;
    @Autowired
    JwtAuthenticationFilter jwtAuthenticationFilter;

    //Inyeccion para el envio de mensajes
    @Autowired
    EmailUtils emailUtils;

    public ResponseEntity<String> signUp(Map<String, String> requestMap){

        log.info("Inside sigup {}", requestMap);

        try {
            if (validateSignUpMap(requestMap)){

                // Obtiene el email del requestMap y busca el usuario en la base de datos
                //Busca en la base de datos si ya hay un usuario con ese email.
                UserEntity userEntity = userRepository.findByEmailId(requestMap.get("email"));

                // Verifica si el usuario no existe (es null)
                if (Objects.isNull(userEntity)){

                    // Si no existe, crea y guarda un nuevo usuario usando los datos del Map
                    userRepository.save(getUserFromMap(requestMap));
                    return CafeUtils.getResponseEntity("Se ha registrado correctamente", HttpStatus.OK);

                }else {

                    //si no existe devuelve un Response entity que no existe
                    return CafeUtils.getResponseEntity("El Email ya existe", HttpStatus.BAD_REQUEST);

                }

            }else {
                return CafeUtils.getResponseEntity(CafeConstants.DATA_INVALIDA,  HttpStatus.BAD_REQUEST);
            }
        }catch (Exception e){
            e.printStackTrace();
        }

        return CafeUtils.getResponseEntity(CafeConstants.SOMETHING_WENT_WRONG, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    private boolean validateSignUpMap(Map<String, String> requestMap){
        // Metodo privado que valida si el mapa contiene los datos necesarios para registro

        if (requestMap.containsKey("name") &&
                requestMap.containsKey("contactNumber") &&
                requestMap.containsKey("email") &&
                requestMap.containsKey("password")){
            // Verifica que existan las claves obligatorias en el Map

            return true;
            // Retorna true si todas las claves están presentes
        }

        return false;
        // Retorna false si falta alguna clave
    }

    //Metodo que devulve un usuario construido de parametors recibe un mapa con lso datos pasados
    private UserEntity getUserFromMap(Map<String, String> requestMap){

        //se crea un nuevo usuario vacio
        UserEntity userEntity = new UserEntity();

        //ha ese usuario se le setean los coampos que vienen del requestMap
        userEntity.setName(requestMap.get("name"));
        userEntity.setContactNumber(requestMap.get("contactNumber"));
        userEntity.setEmail(requestMap.get("email"));
        userEntity.setPassword(requestMap.get("password"));
        userEntity.setStatus("false");
        userEntity.setRole("user");
        //devuelve el usuario completado
        return userEntity;
    }

    public ResponseEntity<?> login(Map<String, String> requestMap){

        log.info("Inside login {}", requestMap); // registra datos de login

        try {

            Authentication auth = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            requestMap.get("email"),
                            requestMap.get("password")
                    )
            ); // autentica usuario con email y password

            if(auth.isAuthenticated()){

                if(customerUsersDetailsService.getUserDetail()
                        .getStatus().equalsIgnoreCase("true")){

                    String token = jwtUtil.generateToken(
                            customerUsersDetailsService.getUserDetail().getEmail(),
                            customerUsersDetailsService.getUserDetail().getRole()
                    ); // genera token JWT

                    return ResponseEntity.ok(
                            Map.of(
                                    "message", "Inicio de sesión exitoso.",
                                    "token", token
                            )
                    );// devuelve token en JSON automático
                }
                else{
                    return ResponseEntity.badRequest()
                            .body(Map.of("message","Espere la aprobación del administrador."));
                }
            }

        } catch(Exception e){
            e.printStackTrace();
        }

        return ResponseEntity.badRequest()
                .body(Map.of("message","Credenciales incorrectas."));
    }

    // Endpoint que devuelve todos los usuarios si el solicitante es admin
    public ResponseEntity<List<UserDto>> getAllUser(){
        try {

            // Verifica si el usuario autenticado en el JWT tiene rol ADMIN
            if (jwtAuthenticationFilter.isAdmin()){

                // Consulta los usuarios desde el repository y responde 200 OK con la lista
                return new ResponseEntity<>(userRepository.getAllUser(), HttpStatus.OK);

            }else{

                // Si no es admin devuelve lista vacía y código 401 Unauthorized
                return new ResponseEntity<>(new ArrayList<>(), HttpStatus.UNAUTHORIZED);
            }

        }catch (Exception e){
            // Imprime el error en consola para depuración
            e.printStackTrace();
        }

        // Si ocurre un error inesperado devuelve 500 Internal Server Error
        return new ResponseEntity<List<UserDto>>(new ArrayList<>(), HttpStatus.INTERNAL_SERVER_ERROR);
    }

    //Metodo para actualizar el status de los usuarios siendo administrador o con una cuenta de administrador
    public ResponseEntity<String> update(Map<String, String> requestMap){

        try {

            //Verficamos que somos administradores
            if (jwtAuthenticationFilter.isAdmin()){

                //Buscamos en la bd un UserEntity si existe ese usuario en la bd
                //Optional debido a que el usuario puede ser estar o no y es asi para evitar un NullPointerException
                Optional<UserEntity> userEntityOptional = userRepository.findById(
                        Integer.parseInt(requestMap.get("id"))
                );

                //si ese objeto UserEntity es diferente de vacio
                if (!userEntityOptional.isEmpty()){

                    //Mediante la query declarada en el repository actualizamos el status del usuario
                    userRepository.updateStatus(
                            requestMap.get("status"),
                            Integer.parseInt(requestMap.get("id"))
                    );

                    //Metodo que permite mandar un correo simple donde nosotros como administradores verificamos que
                    //la cuenta del usuario ha sido aprobada
                    sendMailToAllAdmin(requestMap.get("status"),
                            userEntityOptional.get().getEmail(),
                            userRepository.getAllAdmin());

                    //devolvemos la respuesta
                    return CafeUtils.getResponseEntity(
                            "El status del usuario se actualizo correctamente",
                            HttpStatus.OK
                    );

                }else {
                    //si no existe el usuario devolvemos la respuesta
                    return CafeUtils.getResponseEntity(
                            "El usuario con el id no existe",
                            HttpStatus.OK
                    );
                }

            }else {
                //si no somos administradores nos dara un mensaje de que no tenemos autorizacion
                return CafeUtils.getResponseEntity(
                        CafeConstants.UNAUTHORIZED_ACCESS,
                        HttpStatus.UNAUTHORIZED
                );
            }

        }catch (Exception e){
            System.out.println(e.getMessage());
            e.printStackTrace();
        }

        return CafeUtils.getResponseEntity(
                CafeConstants.SOMETHING_WENT_WRONG,
                HttpStatus.INTERNAL_SERVER_ERROR
        );
    }

    private void sendMailToAllAdmin(String status, String email, List<String> allAdmin) {

       // De la lista allAdmin elimina un userName
        allAdmin.remove(jwtAuthenticationFilter.getCurrentUser());

        //Si el stauts es diferente de nulo y si el status es igual a true
        if (status != null && status.equalsIgnoreCase("true")){

            //Se construye el correo simple
            emailUtils.sendSimpleMessage(jwtAuthenticationFilter.getCurrentUser(),
                    "Cuenta aprobada"
                    ,"Usuario:-"
                            + email
                            + "\n es aprobado por el \n ADMINISTRADOR:-"
                            + jwtAuthenticationFilter.getCurrentUser()
                    ,allAdmin
                    );

        }else {
            emailUtils.sendSimpleMessage(jwtAuthenticationFilter.getCurrentUser(),
                    "Cuenta no aprobada"
                    ,"Usuario:-"
                            + email
                            + "\n fue desaprobado por el \n ADMINISTRADOR:-"
                            + jwtAuthenticationFilter.getCurrentUser()
                    ,allAdmin
            );
        }
    }

    public ResponseEntity<String> checkToken(){

        return CafeUtils.getResponseEntity("true", HttpStatus.OK);
    }

    //Metodo que cambia la contraseña para esto primero se debe logear como admin o como user y poner el token
    //de informacion de sesion, los campos que recibe son oldPassword y newPassword
    public ResponseEntity<String> changePassword(Map<String, String> requestMap){

        try {

            //Buscar en el repositorio de usuarios un usuario por su email (obtenido del filtro JWT) y guardar ese
            //usuario en la variable userObj.
            UserEntity userObj = userRepository.findByEmail(jwtAuthenticationFilter.getCurrentUser());

            //si el objeto es diferente de nulo
            if (!userObj.equals(null)){

                //Se obtiene la antigua contraseña de objeto userObj y lo compara con la oldPassword que se le pasa
                //en el requestMap
                if (userObj.getPassword().equals(requestMap.get("oldPassword"))){

                    //Se actualiza o setea la nueva contraseña al objeto
                    userObj.setPassword(requestMap.get("newPassword"));
                    //Gracias a JpaRepository se usa el metodo save del repositorio para actualizar la bd
                    userRepository.save(userObj);
                    return CafeUtils.getResponseEntity("Contraseña Actualizada", HttpStatus.OK);
                }

                return CafeUtils.getResponseEntity("Antigua contraseña incorrecta", HttpStatus.BAD_REQUEST);
            }

            return CafeUtils.getResponseEntity(CafeConstants.SOMETHING_WENT_WRONG, HttpStatus.INTERNAL_SERVER_ERROR);

        }catch (Exception e){
            System.out.println(e.getMessage());
            e.printStackTrace();
        }

        return CafeUtils.getResponseEntity(CafeConstants.SOMETHING_WENT_WRONG, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    //Metodo para cambiar la contraseña
    public ResponseEntity<String> forgotPassword(Map<String, String> requestMap){

        try {

            //Buscar en el repositorio de usuarios un usuario por su email y guardar ese
            //usuario en la variable userObj.
            UserEntity userObj = userRepository.findByEmail(requestMap.get("email"));

            //se usa para validar que el objeto usuario exista y que su email no esté vacío.
            if (!Objects.isNull(userObj) && !Strings.isNullOrEmpty(userObj.getEmail())){

                //usar la clase emailUtils y construir el mensaje
                emailUtils.forgotEmail(userObj.getEmail(),
                        "Sus datos de acceso para el sistema de gestión de la cafetería",
                        userObj.getPassword());

                return CafeUtils.getResponseEntity("Revise su correo electrónico para ver las credenciales"
                        , HttpStatus.OK);
            }else {
                return CafeUtils.getResponseEntity("Sus credenciales son incorrectas"
                        , HttpStatus.BAD_REQUEST);
            }

        }catch (Exception e){
            System.out.println(e.getMessage());
            e.printStackTrace();
        }

        return CafeUtils.getResponseEntity(CafeConstants.SOMETHING_WENT_WRONG, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
