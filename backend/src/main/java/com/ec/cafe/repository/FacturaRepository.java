package com.ec.cafe.repository;

import com.ec.cafe.entity.FacturaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface FacturaRepository extends JpaRepository<FacturaEntity, Integer> {

    // Obtiene todas las facturas ordenadas por id en forma descendente
    @Query("select f from FacturaEntity f order by f.id desc")
    List<FacturaEntity> getAllFacturas();

    //Selecciona todas las facturas de FacturaEntity donde el campo createBy sea igual a un usuario específico
    //(username), y las ordena por id de forma descendente.”
    @Query("select f from FacturaEntity f where f.createBy=:username order by f.id desc")
    List<FacturaEntity> getAllFacturasUser(@Param("username") String username);

}
