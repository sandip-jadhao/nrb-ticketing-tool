package com.nibl.ticketing.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import javax.crypto.SecretKey;
import java.util.Base64;

public class JwtConfig {

    private static final String SECRET =
            "VGhpc0lzQVN1cGVyU2VjcmV0S2V5Rm9ySldUQXV0aGVudGljYXRpb24xMjM0NTY3ODkw";

    public static final SecretKey SECRET_KEY =
            Keys.hmacShaKeyFor(
                    Base64.getDecoder().decode(SECRET)
            );

    public static final long EXPIRATION =
            1000 * 60 * 60 * 24;
}