package com.ec.cafe.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service
public class JwtUtil {

    private String secret = "mySuperSecretKeyForJwtAuthentication123456789";
    private long expirationTime = 1000 * 60 * 60 * 10; // 10 horas

    // extraer username
    public String extractUsername(String token){
        return extractClaim(token, Claims::getSubject);
    }

    // extraer expiration
    public Date extractExpiration(String token){
        return extractClaim(token, Claims::getExpiration);
    }

    // extraer claim
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver){
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    // extraer todos los claims
    public Claims extractAllClaims(String token){
        return Jwts.parser()
                .setSigningKey(secret)
                .parseClaimsJws(token)
                .getBody();
    }

    // verificar expiración
    private Boolean isTokenExpired(String token){
        return extractExpiration(token)
                .before(new Date());
    }

    // generar token
    public String generateToken(String username, String role){
        Map<String, Object> claims = new HashMap<>();
        claims.put("role", role);
        return createToken(claims, username);
    }

    // crear token
    private String createToken(Map<String, Object> claims, String subject){
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + expirationTime))
                .signWith(SignatureAlgorithm.HS256, secret)
                .compact();
    }

    // validar token
    public Boolean validateToken(String token, UserDetails userDetails){
        final String extractedUsername = extractUsername(token);
        return (extractedUsername.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }
}