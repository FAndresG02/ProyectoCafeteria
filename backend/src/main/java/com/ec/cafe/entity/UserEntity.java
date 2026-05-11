package com.ec.cafe.entity;

// Importaciones necesarias para JPA, Hibernate y Lombok
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.DynamicUpdate;
import java.io.Serializable;

@Data // Lombok: genera automáticamente getters, setters, toString, equals y hashCode
@Entity // JPA: indica que esta clase es una entidad que representa una tabla en la BD
@DynamicUpdate // Hibernate: solo actualiza en SQL las columnas que cambiaron
@Table(name = "user") // Especifica el nombre de la tabla en la base de datos
public class UserEntity implements Serializable { // Implementa Serializable para permitir que el objeto pueda convertirse en bytes (buena práctica en entidades)

    // Identificador único para la serialización
    // Sirve para verificar compatibilidad cuando el objeto es serializado/deserializado
    private static final Long serialVersionUID = 1L;

    @Id // Indica que este campo es la clave primaria (PRIMARY KEY)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    // La base de datos genera automáticamente el ID (auto_increment en MySQL)

    @Column(name = "id")
    // Mapea este atributo con la columna "name" en la base de datos
    private Integer id; // Campo que representa la clave primaria

    @Column(name = "name")
    private String name;

    @Column(name = "contactNumber")
    private String contactNumber;

    @Column(name = "email")
    private String email;

    @Column(name = "password")
    private String password;

    @Column(name = "status")
    private String status;

    @Column(name = "role")
    private String role;

}
