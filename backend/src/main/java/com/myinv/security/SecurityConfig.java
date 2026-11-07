package com.myinv.security;

import com.myinv.usuario.Rol;
import com.myinv.usuario.UsuarioRepository;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

/**
 * Seguridad de la API con JWT y permisos por rol (ver tabla de permisos en docs/contrato-api.md).
 */
@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http,
                                                   JwtService jwtService,
                                                   UsuarioRepository usuarioRepository,
                                                   RespuestaErrorSeguridad respuestaError) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .cors(Customizer.withDefaults())
                .httpBasic(AbstractHttpConfigurer::disable)
                .formLogin(AbstractHttpConfigurer::disable)
                .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .exceptionHandling(e -> e
                        .authenticationEntryPoint(respuestaError)
                        .accessDeniedHandler(respuestaError))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers("/error").permitAll()
                        .requestMatchers("/api/health", "/api/auth/login").permitAll()
                        // Consultas: ambos roles
                        .requestMatchers(HttpMethod.GET, "/api/**").hasAnyRole(Rol.ADMINISTRADOR, Rol.EMPLEADO)
                        // Registrar movimientos de stock: ambos roles
                        .requestMatchers(HttpMethod.POST, "/api/movimientos").hasAnyRole(Rol.ADMINISTRADOR, Rol.EMPLEADO)
                        // Altas, modificaciones y bajas: solo administrador
                        .requestMatchers("/api/**").hasRole(Rol.ADMINISTRADOR)
                        .anyRequest().authenticated())
                .addFilterBefore(new JwtAuthFilter(jwtService, usuarioRepository),
                        UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
