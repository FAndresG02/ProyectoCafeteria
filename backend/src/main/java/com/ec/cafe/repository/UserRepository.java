package com.ec.cafe.repository;

import com.ec.cafe.dto.UserDto;
import com.ec.cafe.entity.UserEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface UserRepository extends JpaRepository<UserEntity, Integer> {
    // Extiende JpaRepository → maneja UserEntity con ID tipo Integer

    // Busca usuario por email
    @Query("select u from UserEntity u where u.email = :email")
    UserEntity findByEmailId(@Param("email") String email);

    // Devuelve todos los usuarios con rol USER en formato DTO
    @Query("select new com.ec.cafe.dto.UserDto(u.name, u.id, u.email, u.contactNumber, u.status) " +
            "from UserEntity u where u.role = 'user'")
    List<UserDto> getAllUser();

    // Busca los correos electrónicos de todos los usuarios que tienen rol admin.
    @Query("select u.email " +
            "from UserEntity u where u.role = 'admin'")
    List<String> getAllAdmin();

    @Transactional
    @Modifying
    @Query("update UserEntity u set u.status=:status where u.id=:id")
    int updateStatus(@Param("status") String status, @Param("id") Integer id);


    UserEntity findByEmail(String email);


}
