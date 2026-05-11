package com.ec.cafe.service;

import com.ec.cafe.config.CafeConstants;
import com.ec.cafe.dto.ProductDto;
import com.ec.cafe.entity.CategoryEntity;
import com.ec.cafe.entity.ProductEntity;
import com.ec.cafe.repository.ProductRepository;
import com.ec.cafe.security.JwtAuthenticationFilter;
import com.ec.cafe.utils.CafeUtils;
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
public class ProductService {

    //Inyeccion para poder usar metodos de JPA
    @Autowired
    ProductRepository productRepository;

    //Inyeccion para verficar seguridad ver si somos admin
    @Autowired
    JwtAuthenticationFilter jwtAuthenticationFilter;

    // Método para añadir un nuevo producto
    public ResponseEntity<String> addNewProduct(Map<String, String> requesMap){

        try {

            // Verifica si el usuario autenticado tiene rol de administrador
            // Solo los administradores pueden agregar productos
            if (jwtAuthenticationFilter.isAdmin()){

                // Valida que el requestMap tenga los datos necesarios para crear el producto
                if (validateProductMap(requesMap, false)){

                    // Convierte el Map recibido en un objeto ProductEntity
                    // y lo guarda en la base de datos usando el repositorio JPA
                    productRepository.save(getProductFromMap(requesMap, false));

                    return CafeUtils.getResponseEntity("Producto añadido correctamente", HttpStatus.OK);

                }else {
                    // Si los datos enviados no cumplen la validación
                    return CafeUtils.getResponseEntity(CafeConstants.DATA_INVALIDA, HttpStatus.BAD_REQUEST);
                }

            }else {
                // Si el usuario no es administrador se deniega el acceso
                return CafeUtils.getResponseEntity(CafeConstants.UNAUTHORIZED_ACCESS, HttpStatus.UNAUTHORIZED);
            }

        }catch (Exception e){
            // En caso de error se imprime el stacktrace para depuración
            System.out.println(e.getMessage());
            e.printStackTrace();
        }

        // Respuesta genérica si ocurre un error inesperado
        return CafeUtils.getResponseEntity(CafeConstants.SOMETHING_WENT_WRONG, HttpStatus.INTERNAL_SERVER_ERROR);
    }


    // Método para validar los datos necesarios del producto
    // requestMap: contiene los datos enviados desde el cliente
    // validateId: indica si también se debe validar el id (caso actualización)
    private boolean validateProductMap(Map<String, String> requesMap, boolean validateid) {

        // Verifica que el nombre del producto exista en el request
        if (requesMap.containsKey("name")){

            // Si validateId es verdadero, significa que se está actualizando
            // por lo tanto el id del producto debe venir en el request
            if (requesMap.containsKey("id") && validateid){
                return true;

                // Si validateId es false significa que se está creando un producto nuevo
                // y no es necesario que venga un id
            }else if (!validateid){
                return true;
            }
        }

        // Si no existe el campo name o faltan datos requeridos
        return false;
    }


    // Método que construye un objeto ProductEntity a partir de los datos del Map
    private ProductEntity getProductFromMap(Map<String, String> requesMap, boolean isAdd) {

        // Se crea una instancia de CategoryEntity
        // ya que cada producto debe estar asociado a una categoría
        CategoryEntity categoryEntity = new CategoryEntity();

        // Se asigna el id de la categoría recibido en el request
        // esto representa la clave foránea en la tabla product
        categoryEntity.setId(Integer.parseInt(requesMap.get("categoryId")));

        // Se crea la entidad ProductEntity que será persistida en la base de datos
        ProductEntity productEntity = new ProductEntity();

        // Si isAdd es true significa que el producto se está actualizando
        // por lo tanto se asigna el id del producto existente
        if (isAdd){
            productEntity.setId(Integer.parseInt(requesMap.get("id")));

            // Si es un producto nuevo no se asigna id porque la base de datos lo generará automáticamente
            // También se establece el estado del producto como activo
        }else{
            productEntity.setStatus("true");
        }

        // Se asignan los datos del producto recibidos en el request
        productEntity.setCategoryEntity(categoryEntity);
        productEntity.setName(requesMap.get("name"));
        productEntity.setDescription(requesMap.get("description"));
        productEntity.setPrice(Integer.parseInt(requesMap.get("price")));

        // Se devuelve la entidad lista para ser guardada por JPA
        return productEntity;

    }

    // Método para obtener todos los productos utilizando el formato ProductDto.
    // Devuelve una lista de ProductDto en lugar de entidades completas,
    // ya que el DTO contiene solo los datos necesarios para el cliente.
    public ResponseEntity<List<ProductDto>> getAllProduct(){

        try {

            // Verifica si el usuario autenticado tiene permisos de administrador
            // Solo los administradores pueden consultar la lista completa de productos
            if (jwtAuthenticationFilter.isAdmin()){

                // Llama al método getAllProduct() del repositorio.
                // Este método ejecuta la consulta JPQL definida en el repository
                // y devuelve los resultados directamente mapeados a ProductDto.
                return new ResponseEntity<>(productRepository.getAllProduct(), HttpStatus.OK);

            }else {
                // Si el usuario no tiene permisos de administrador
                // se devuelve una lista vacía con estado HTTP 401 (no autorizado)
                return new ResponseEntity<>(new ArrayList<>(), HttpStatus.UNAUTHORIZED);
            }

        }catch (Exception e){
            // Captura cualquier error inesperado durante la ejecución
            // e imprime la información del error en la consola para depuración
            System.out.println(e.getMessage());
            e.printStackTrace();
        }

        // Si ocurre un error del servidor se devuelve una lista vacía
        // junto con el código HTTP 500 (error interno del servidor)
        return new ResponseEntity<>(new ArrayList<>(), HttpStatus.INTERNAL_SERVER_ERROR);
    }

    // Método para actualizar un producto existente
    public ResponseEntity<String> updateProduct(Map<String, String> requesMap){

        try {

            // Verifica si el usuario autenticado tiene rol de administrador
            if (jwtAuthenticationFilter.isAdmin()){

                // Valida que el requestMap contenga los datos necesarios para actualizar el producto (incluyendo id)
                if (validateProductMap(requesMap, true)){

                    // Busca el producto en la base de datos usando el id recibido en el request
                    Optional<ProductEntity> productEntityOptional = productRepository.findById(Integer.parseInt(requesMap.get("id")));

                    // Verifica si el producto existe en la base de datos
                    if (!productEntityOptional.isEmpty()){

                        // Crea un objeto ProductEntity con los nuevos datos enviados en el request
                        ProductEntity productEntity = getProductFromMap(requesMap, true);

                        // Mantiene el estado actual del producto (status) para evitar que se modifique accidentalmente
                        productEntity.setStatus(productEntityOptional.get().getStatus());

                        // Guarda los cambios del producto en la base de datos (JPA ejecutará un UPDATE)
                        productRepository.save(productEntity);

                        // Devuelve una respuesta HTTP indicando que el producto fue actualizado correctamente
                        return CafeUtils.getResponseEntity("Producto actualizado correctamente", HttpStatus.OK);

                    }else {

                        // Si el producto no existe en la base de datos devuelve un error
                        return CafeUtils.getResponseEntity("El producto no se encuentra", HttpStatus.BAD_REQUEST);

                    }

                }else {
                    // Si los datos enviados no pasan la validación devuelve error de datos inválidos
                    return CafeUtils.getResponseEntity(CafeConstants.DATA_INVALIDA, HttpStatus.BAD_REQUEST);
                }

            }else {
                // Si el usuario no tiene permisos de administrador se deniega el acceso
                return CafeUtils.getResponseEntity(CafeConstants.UNAUTHORIZED_ACCESS, HttpStatus.UNAUTHORIZED);
            }

        }catch (Exception e){
            // Captura cualquier excepción inesperada y la imprime en consola para depuración
            System.out.println(e.getMessage());
            e.printStackTrace();
        }

        // Si ocurre un error del servidor se devuelve una respuesta HTTP 500
        return CafeUtils.getResponseEntity(CafeConstants.SOMETHING_WENT_WRONG, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    public ResponseEntity<String> deleteProduct(Integer id){

        try {

            //Verificamos que somos administradores
            if (jwtAuthenticationFilter.isAdmin()){

                //Comprobamos si el producto existe en la bd
                Optional<ProductEntity> productEntityOptional = productRepository.findById(id);

                //si el producto existe tambien deber estar lleno no vacio
                if (!productEntityOptional.isEmpty()){

                    //Se elimina el producto en base a su id
                    productRepository.deleteById(id);

                    return CafeUtils.getResponseEntity("Producto eliminado", HttpStatus.OK);

                }else {

                    return CafeUtils.getResponseEntity("El producto no existe", HttpStatus.OK);

                }

            }else {
                return CafeUtils.getResponseEntity(CafeConstants.UNAUTHORIZED_ACCESS, HttpStatus.UNAUTHORIZED);
            }

        }catch (Exception e){
            System.out.println(e.getMessage());
            e.printStackTrace();
        }

        return CafeUtils.getResponseEntity(CafeConstants.SOMETHING_WENT_WRONG, HttpStatus.INTERNAL_SERVER_ERROR);
    }


    public ResponseEntity<String> updateStatus(Map<String, String> requestMap){
        try {

            if (jwtAuthenticationFilter.isAdmin()){

                // Busca el producto en la BD por id; retorna Optional para evitar NullPointerException si no existe
                Optional<ProductEntity> productEntityOptional = productRepository.findById(Integer.parseInt(requestMap.get("id")));

                // Verifica que el producto exista antes de intentar actualizarlo
                if (!productEntityOptional.isEmpty()){

                    // Si existe, actualiza solo el campo status del producto con el nuevo valor recibido
                    productRepository.updateProductStatus(requestMap.get("status"), Integer.parseInt(requestMap.get("id")));

                    return CafeUtils.getResponseEntity("El status el producto se actualizo correctamente", HttpStatus.OK);

                }else {
                    // Si el producto no existe en la base de datos devuelve un error
                    return CafeUtils.getResponseEntity("El producto no se encuentra", HttpStatus.OK);
                }

            }else {
                return CafeUtils.getResponseEntity(CafeConstants.UNAUTHORIZED_ACCESS, HttpStatus.UNAUTHORIZED);
            }

        }catch (Exception e){
            System.out.println(e.getMessage());
            e.printStackTrace();
        }

        return CafeUtils.getResponseEntity(CafeConstants.SOMETHING_WENT_WRONG, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    //Metodo para obtener los productos relacionados a una categoria
    public ResponseEntity<List<ProductDto>> getByCategory(Integer id){

        try {

            if (jwtAuthenticationFilter.isAdmin() || jwtAuthenticationFilter.isUser()){

                return new ResponseEntity<> (productRepository.getAllProductByCategory(id), HttpStatus.OK);

            }else {
                return new ResponseEntity<> (new ArrayList<>(), HttpStatus.UNAUTHORIZED);
            }

        }catch (Exception e){
            System.out.println(e.getMessage());
            e.printStackTrace();
        }

        return new ResponseEntity<> (new ArrayList<>(), HttpStatus.INTERNAL_SERVER_ERROR);
    }

    public ResponseEntity<ProductDto> getProductById(Integer id){

        try {

            if (jwtAuthenticationFilter.isAdmin() || jwtAuthenticationFilter.isUser()){

                return new ResponseEntity<> (productRepository.getProductById(id), HttpStatus.OK);

            }else {
                return new ResponseEntity<> (new ProductDto(), HttpStatus.UNAUTHORIZED);
            }

        }catch (Exception e){
            System.out.println(e.getMessage());
            e.printStackTrace();
        }

        return new ResponseEntity<>(new ProductDto(), HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
