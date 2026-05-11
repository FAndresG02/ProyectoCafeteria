package com.ec.cafe.entity;

import jakarta.persistence.*;
import jakarta.persistence.criteria.CriteriaBuilder;
import lombok.Data;
import org.hibernate.annotations.DynamicUpdate;

import java.io.Serializable;

@Data // Lombok: genera automáticamente getters, setters, toString, equals y hashCode
@Entity // JPA: indica que esta clase es una entidad que representa una tabla en la BD
@DynamicUpdate // Hibernate: solo actualiza en SQL las columnas que cambiaron
@Table(name = "factura") // Especifica el nombre de la tabla en la base de datos
public class FacturaEntity implements Serializable {


    private static final long serialVersionUID= 1L;

    @Id // Indica que este campo es la clave primaria (PRIMARY KEY)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    // La base de datos genera automáticamente el ID (auto_increment en MySQL)
    @Column(name = "id")
    // Mapea este atributo con la columna "name" en la base de datos
    private Integer id; // Campo que representa la clave primaria

    @Column(name = "uuid")
    private String uuid;

    @Column(name = "name")
    private String name;

    @Column(name = "email")
    private String email;

    @Column(name = "contactNumber")
    private String contactNumber;

    @Column(name = "paymentMethod")
    private String paymentMethod;

    @Column(name = "total")
    private Integer total;

    @Column(name = "productDetail", columnDefinition = "json")
    private String productDetail;

    @Column(name = "createBy")
    private String createBy;
}
