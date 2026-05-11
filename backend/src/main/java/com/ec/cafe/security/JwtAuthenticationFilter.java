package com.ec.cafe.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

// Filtro que se ejecuta una sola vez por cada request HTTP
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    // Utilidad que contiene métodos para trabajar con JWT (extraer claims, validar token, etc.)
    private final JwtUtil jwtUtil;

    // Servicio que carga los datos del usuario desde la base de datos
    private final CustomerUsersDetailsService userDetailsService;

    // Variable para almacenar los claims (datos dentro del token JWT)
    Claims claims = null;

    // Variable para almacenar el username del usuario autenticado
    private String userName = null;

    // Constructor que recibe las dependencias necesarias para el filtro
    public JwtAuthenticationFilter(JwtUtil jwtUtil,
                                   CustomerUsersDetailsService userDetailsService) {

        // Asigna la utilidad JWT recibida al atributo del filtro
        this.jwtUtil = jwtUtil;

        // Asigna el servicio de usuarios al atributo del filtro
        this.userDetailsService = userDetailsService;
    }

    // Método que se ejecuta automáticamente por cada request HTTP
    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        // Obtiene el header Authorization del request HTTP
        String authorizationHeader = request.getHeader("Authorization");

        // Variable para almacenar el username extraído del JWT
        String username = null;

        // Variable para almacenar el token JWT
        String jwt = null;

        try {
            // Verifica que el header exista y que empiece con "Bearer "
            if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {

                // Extrae el token quitando la palabra "Bearer "
                jwt = authorizationHeader.substring(7);

                // Extrae todos los datos (claims) contenidos dentro del JWT
                claims = jwtUtil.extractAllClaims(jwt);

                // Extrae el username contenido en el JWT
                username = jwtUtil.extractUsername(jwt);

                // Guarda el username en la variable del filtro para poder usarlo después
                this.userName = username;
            }

            // Verifica que el username exista y que aún no haya autenticación en el contexto de seguridad
            if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {

                // Carga los datos del usuario desde la base de datos usando el username
                UserDetails userDetails = userDetailsService.loadUserByUsername(username);

                // Valida que el token sea correcto y que corresponda al usuario
                if (jwtUtil.validateToken(jwt, userDetails)) {

                    // Crea un objeto de autenticación con los datos del usuario y sus roles
                    UsernamePasswordAuthenticationToken authToken =
                            new UsernamePasswordAuthenticationToken(
                                    userDetails,
                                    null,
                                    userDetails.getAuthorities()
                            );

                    // Guarda la autenticación en el contexto de seguridad de Spring
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            }

        } catch (ExpiredJwtException e) {
            System.out.println("Token expirado: " + e.getMessage());
            // No hace nada, simplemente continúa sin autenticar
        } catch (Exception e){
            System.out.println(e.getMessage());
            e.printStackTrace();
        }
        // Continúa con el siguiente filtro en la cadena de filtros
        filterChain.doFilter(request, response);
    }

    // Método para verificar si el usuario del token tiene rol admin
    public boolean isAdmin(){

        // Si no hay claims significa que no hay token procesado
        if(claims == null){
            return false;
        }

        // Retorna true si el rol dentro del token es "admin"
        return "admin".equalsIgnoreCase((String) claims.get("role"));
    }

    // Método para verificar si el usuario del token tiene rol user
    public boolean isUser(){

        // Si no hay claims significa que no hay token procesado
        if(claims == null){
            return false;
        }

        // Retorna true si el rol dentro del token es "user"
        return "user".equalsIgnoreCase((String) claims.get("role"));
    }

    // Método que devuelve el username del usuario autenticado en el JWT
    public String getCurrentUser(){

        // Retorna el username guardado cuando se procesó el token
        return userName;
    }

}
