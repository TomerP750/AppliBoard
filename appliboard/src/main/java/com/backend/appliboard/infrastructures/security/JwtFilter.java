package com.backend.appliboard.infrastructures.security;

import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.UUID;


@Slf4j
@Component
@RequiredArgsConstructor
public class JwtFilter extends OncePerRequestFilter {

    private final PrincipalUserService principalUserService;
    private final JwtService jwtService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

        try {
            authenticateWithAccessToken(request);
        } catch (JwtException | UsernameNotFoundException e) {
            // Expired tokens are routine (every 15 minutes per user), so this is debug, not an error.
            log.debug("Rejected access token: {}", e.getMessage());
            // 401 (not 500) so the frontend refreshes the session or logs the user out.
            SecurityContextHolder.clearContext();
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid or expired access token");
            return;
        }

        filterChain.doFilter(request, response);
    }

    /**
     * Signs the request in when it carries a valid access token. Without a token the request stays anonymous,
     * and protected endpoints answer 401 (see the entry point in {@link SecurityConfig}).
     *
     * @throws JwtException when the token is malformed, expired, badly signed or not an access token
     * @throws UsernameNotFoundException when the token is valid but its user was deleted
     */
    private void authenticateWithAccessToken(HttpServletRequest request) throws UsernameNotFoundException {
        String token = parseJwt(request);
        if (token == null || SecurityContextHolder.getContext().getAuthentication() != null) {
            return;
        }

        UUID userId = jwtService.extractUserIdFromAccessToken(token);
        PrincipalUser principalUser = principalUserService.loadByUserId(userId);

        Authentication auth = new UsernamePasswordAuthenticationToken(
                principalUser,
                null,
                principalUser.getAuthorities()
        );
        SecurityContextHolder.getContext().setAuthentication(auth);
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        return request.getServletPath().startsWith("/api/auth");
    }

    private String parseJwt(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            return authHeader.substring(7);
        }
        return null;
    }
}
