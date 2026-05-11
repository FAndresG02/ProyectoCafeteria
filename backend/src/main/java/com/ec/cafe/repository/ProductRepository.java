package com.ec.cafe.repository;

import com.ec.cafe.dto.ProductDto;
import com.ec.cafe.entity.ProductEntity;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProductRepository extends JpaRepository<ProductEntity, Integer> {

    // Consulta JPQL que obtiene información de los productos y su categoría.
    // En lugar de devolver entidades completas (ProductEntity), se construyen
    // directamente objetos ProductDto para enviar solo los datos necesarios.
    //
    // Se seleccionan los siguientes campos:
    // - id del producto
    // - nombre del producto
    // - descripción
    // - precio
    // - estado del producto
    // - id de la categoría asociada
    // - nombre de la categoría
    //
    // El operador "new" en JPQL permite instanciar el DTO directamente
    // usando el constructor de ProductDto con los campos seleccionados.
    @Query("select new com.ec.cafe.dto.ProductDto(p.id, p.name, p.description, p.price, p.status, p.categoryEntity.id, p.categoryEntity.name)" +
            "from ProductEntity p")
    List<ProductDto> getAllProduct();

    // Query JPQL que actualiza el campo status de un producto por su id
    @Query("UPDATE ProductEntity p SET p.status = :status WHERE p.id = :id")
    // Indica que la query modifica datos (UPDATE/DELETE), no es un SELECT
    @Modifying
    // Envuelve la operación en una transacción; hace rollback si algo falla
    @Transactional
    // Retorna el número de filas afectadas; 0 si no existe, 1 si actualizó
    Integer updateProductStatus(@Param("status") String status, @Param("id") Integer id);

    //Selecciona todos los productos que pertenezcan a una categoría específica y estén activos status='true'
    @Query("select new com.ec.cafe.dto.ProductDto(p.id, p.name)" +
            "from ProductEntity p where p.categoryEntity.id=:id and p.status='true'")
    List<ProductDto> getAllProductByCategory(@Param("id") Integer id);

    @Query("select new com.ec.cafe.dto.ProductDto(p.id, p.name, p.description, p.price)" +
            "from ProductEntity p where p.id=:id")
    ProductDto getProductById(@Param("id") Integer id);




}
