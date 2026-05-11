package com.ec.cafe.service;

import com.ec.cafe.config.CafeConstants;
import com.ec.cafe.entity.CategoryEntity;
import com.ec.cafe.repository.CategoryRepository;
import com.ec.cafe.security.JwtAuthenticationFilter;
import com.ec.cafe.utils.CafeUtils;
import com.google.common.base.Strings;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Slf4j
@Service
public class CategoryService {

    @Autowired
    CategoryRepository categoryRepository;

    @Autowired
    JwtAuthenticationFilter jwtAuthenticationFilter;

    // Metodo para crear una nueva categoria en el sistema
    public ResponseEntity<String> addNewCategory(Map<String, String> requestMap){

        try {

            // Se verifica si el usuario autenticado en el JWT tiene rol de ADMIN
            // Solo los administradores pueden crear nuevas categorias
            if (jwtAuthenticationFilter.isAdmin()){

                // Se valida que el requestMap contenga los datos necesarios
                // En este caso validateId = false porque no es necesario enviar el id
                // ya que la base de datos lo genera automaticamente
                if (validateCategoryMap(requestMap, false)){

                    // Se construye un objeto CategoryEntity a partir del requestMap
                    // y se guarda en la base de datos
                    categoryRepository.save(getCategoryFromMap(requestMap, false));

                    // Se devuelve una respuesta indicando que la categoria fue creada correctamente
                    return CafeUtils.getResponseEntity("Categoria creada", HttpStatus.OK);

                }

            }else{
                // Si el usuario no es administrador se devuelve acceso no autorizado
                CafeUtils.getResponseEntity(CafeConstants.UNAUTHORIZED_ACCESS, HttpStatus.UNAUTHORIZED);
            }

        }catch (Exception e){
            // Se imprime el error en consola en caso de que ocurra una excepción
            System.out.println(e.getMessage());
            e.printStackTrace();
        }

        // Respuesta generica en caso de que ocurra algun error en la ejecucion
        return CafeUtils.getResponseEntity(CafeConstants.SOMETHING_WENT_WRONG, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    // Metodo que valida los datos enviados en el requestMap para la categoría.
    // Devuelve true si los datos requeridos existen, de lo contrario false.
    private boolean validateCategoryMap(Map<String, String> requestMap, boolean validateId){

        // Verifica que el request contenga la clave "name" (campo obligatorio para la categoría)
        if (requestMap.containsKey("name")){

            // Si validateId es true, también se requiere que exista la clave "id"
            // Esto se usa normalmente cuando se quiere actualizar una categoría
            if (requestMap.containsKey("id") && validateId){
                return true;

                // Si validateId es false, solo se valida el campo "name"
                // Esto se usa cuando se crea una nueva categoría (no se necesita id)
            }else if (!validateId){
                return true;
            }
        }

        // Si no se cumplen las condiciones anteriores se retorna false
        return false;
    }


    // Metodo que construye un objeto CategoryEntity a partir de los datos recibidos en el requestMap
    private CategoryEntity getCategoryFromMap(Map<String, String> requestMap, boolean isAdd){

        // Se crea una nueva instancia de CategoryEntity
        CategoryEntity categoryEntity = new CategoryEntity();

        // Si isAdd es true, se asigna el id al objeto
        // Esto normalmente se usa cuando se está actualizando una categoría existente
        if (isAdd){
            categoryEntity.setId(Integer.parseInt(requestMap.get("id")));
        }

        // Se asigna el nombre de la categoría desde el requestMap
        // Este campo se usa tanto para crear como para actualizar la categoría
        categoryEntity.setName(requestMap.get("name"));

        // Se retorna el objeto CategoryEntity listo para ser guardado o actualizado en la base de datos
        return categoryEntity;
    }

    //Metodo para devolver todas las categorias
    public ResponseEntity<List<CategoryEntity>> getAllCategory(String filterValue){
        try {

            //Verifica si filterValue no esta vacio y comprara si el contenido de filterValue es igual a true
            if (!Strings.isNullOrEmpty(filterValue) && filterValue.equalsIgnoreCase("true")){
                //si se cumple la condicion obtiene todas las categorias de la bd usando el metodo declarado en el
                //categoryRepository
                return new ResponseEntity<List<CategoryEntity>>(categoryRepository.getAllCategory(), HttpStatus.OK);
            }

            return new ResponseEntity<List<CategoryEntity>>(categoryRepository.findAll(), HttpStatus.OK);

        }catch (Exception e){
            System.out.println(e.getMessage());
            e.printStackTrace();
        }

        return new ResponseEntity<List<CategoryEntity>>(new ArrayList<>(), HttpStatus.INTERNAL_SERVER_ERROR);
    }

    public ResponseEntity<String> updateCategory(Map<String, String> requestMap){

        try {

            if (jwtAuthenticationFilter.isAdmin()){

                // Se valida que el requestMap contenga los datos necesarios
                // En este caso validateId = true porque es necesario enviar el id
                // ya que les necesario para actualizar
                if (validateCategoryMap(requestMap, true)){

                    Optional userOptional = categoryRepository.findById(Integer.parseInt(requestMap.get("id")));

                    if (!userOptional.isEmpty()){

                        // Se construye un objeto CategoryEntity a partir del requestMap
                        // y se guarda en la base de datos
                        categoryRepository.save(getCategoryFromMap(requestMap, true));

                        // Se devuelve una respuesta indicando que la categoria fue actualizada correctamente
                        return CafeUtils.getResponseEntity("Categoria actualizada", HttpStatus.OK);

                    }else {

                        return CafeUtils.getResponseEntity("Categoria no existe", HttpStatus.BAD_REQUEST);

                    }

                }else{
                    return CafeUtils.getResponseEntity("Datos invalidos", HttpStatus.BAD_REQUEST);
                }

            }else{
                // Si el usuario no es administrador se devuelve acceso no autorizado
                return CafeUtils.getResponseEntity(CafeConstants.UNAUTHORIZED_ACCESS, HttpStatus.UNAUTHORIZED);
            }

        }catch (Exception e){
            System.out.println(e.getMessage());
            e.printStackTrace();
        }
        return CafeUtils.getResponseEntity(CafeConstants.SOMETHING_WENT_WRONG, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
