package com.ec.cafe.repository;

import com.ec.cafe.entity.CategoryEntity;
import com.ec.cafe.entity.ProductEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface CategoryRepository extends JpaRepository<CategoryEntity, Integer> {

    //Selecciona todas las categorías (CategoryEntity)
    //cuyo id esté dentro de las categorías
    //de los productos (ProductEntity)
    //que tienen status = true
    //si una categoría no tiene ningún producto, esa query no la va a devolver.
    @Query("select c from CategoryEntity c where c.id in (select p.categoryEntity.id from ProductEntity p where p.status='true')")
    List<CategoryEntity> getAllCategory();

}
