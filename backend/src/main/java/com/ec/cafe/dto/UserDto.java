package com.ec.cafe.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

//Etiqueta de lombok para crear getter y setter
@Data
//e utiliza para generar automáticamente un constructor sin argumentos
@NoArgsConstructor
public class UserDto {

    //todos estos parmetros son para verificar el status del usuario
    private Integer id;
    private String name;
    private String email;
    private String contactNumber;
    private String status;

    public UserDto(String name, Integer id, String email, String contactNumber, String status) {
        this.name = name;
        this.id = id;
        this.email = email;
        this.contactNumber = contactNumber;
        this.status = status;
    }
}
