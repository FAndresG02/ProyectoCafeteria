package com.ec.cafe.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.DynamicUpdate;

import java.io.Serializable;

@Data // Lombok: genera automáticamente getters, setters, toString, equals y hashCode
@Entity // JPA: indica que esta clase es una entidad que representa una tabla en la BD
@DynamicUpdate // Hibernate: solo actualiza en SQL las columnas que cambiaron
@Table(name = "product") // Especifica el nombre de la tabla en la base de datos
public class ProductEntity implements Serializable {

    // Identificador único para la serialización
    // Sirve para verificar compatibilidad cuando el objeto es serializado/deserializado
    private static final Long serialVersionUID = 123456L;

    @Id // Indica que este campo es la clave primaria (PRIMARY KEY)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    // La base de datos genera automáticamente el ID (auto_increment en MySQL)
    @Column(name = "id")
    // Mapea este atributo con la columna "name" en la base de datos
    private Integer id; // Campo que representa la clave primaria

    @Column(name = "name")
    private String name;

    //@ManyToOne muchos registros de esta tabla pertenecen a una sola categoría
    //fetch = FetchType.LAZY la categoría NO se carga automáticamente cuando consultas el producto
    @ManyToOne(fetch = FetchType.LAZY)
    //Define la columna de la clave foránea en la base de datos.
    //categoryEntity_fk Significa que la tabla tendrá una columna:
    //nullable = false la relación es obligatoria la relación es obligatoria No puedes guardar un producto sin categoría.
    @JoinColumn(name = "categoryEntity_fk", nullable = false)
    private CategoryEntity categoryEntity;

    @Column(name = "description")
    private String description;

    @Column(name = "price")
    private Integer price;

    @Column(name = "status")
    private String status;

}
