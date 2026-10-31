package com.ems.security;

import java.security.Key;
import java.util.Date;

import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {
    // Secret key (must be at least 256 bits)
    private static final String SECRET_KEY =
            "9d1d5b0d4c5b9c7a8e6f1d2c3b4a5e6f9d1d5b0d4c5b9c7a8e6f1d2c3b4a5e6f";

   private Key getSignInKey() {
    return Keys.hmacShaKeyFor(
        SECRET_KEY.getBytes()
    );
}
    // Generate Token
    public String generateToken(String email) {

        return Jwts.builder()
                .setSubject(email)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis()
                        + 1000 * 60 * 60 * 24))
                .signWith(getSignInKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    // Extract Email
    public String extractEmail(String token) {

        Claims claims = Jwts.parserBuilder()
                .setSigningKey(getSignInKey())
                .build()
                .parseClaimsJws(token)
                .getBody();

        return claims.getSubject();
    }

    // Validate Token
    public boolean isTokenValid(String token, String email) {

        String extractedEmail = extractEmail(token);

        return extractedEmail.equals(email);
    }
}