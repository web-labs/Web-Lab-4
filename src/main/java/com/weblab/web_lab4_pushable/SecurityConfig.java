package com.weblab.web_lab4_pushable;



import org.springframework.context.annotation.Bean;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;

import java.util.List;

@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
                .cors(cors -> cors
                        .configurationSource(request -> {
                            CorsConfiguration configuration = new CorsConfiguration();
                            configuration.setAllowedOrigins(List.of("http://localhost"));
                            configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
                            configuration.setAllowedHeaders(List.of("Authorization", "Cache-Control", "Content-Type"));
                            return configuration;
                        })
                )
                .csrf().disable()
                .authorizeRequests(authorizeRequests ->
                        authorizeRequests
                                .anyRequest().authenticated()
                )
                .oauth2ResourceServer(oauth2 -> oauth2
                        .jwt(jwt -> jwt
                                .jwtAuthenticationConverter(jwtAuthenticationConverter())
                        )
                );

        return http.build();
    }

    private JwtAuthenticationConverter jwtAuthenticationConverter() {
        JwtAuthenticationConverter jwtConverter = new JwtAuthenticationConverter();
        jwtConverter.setJwtGrantedAuthoritiesConverter(jwt -> new JwtGrantedAuthoritiesConverter().convert(jwt));
        return jwtConverter;
    }

}

//@EnableWebSecurity
//public class SecurityConfig {
//
//    @Bean
//    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
//        JwtAuthenticationConverter jwtConverter = new JwtAuthenticationConverter();
//        http
//
//                .cors(cors -> cors
//                        .configurationSource(request -> {
//                            CorsConfiguration configuration = new CorsConfiguration();
//                            configuration.setAllowedOrigins(List.of("http://localhost"));
//                            configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
//                            configuration.setAllowedHeaders(List.of("Authorization", "Cache-Control", "Content-Type"));
//                            return configuration;
//                        })
//                )
//                .csrf().disable()
//                .authorizeRequests(authorizeRequests ->
//                        authorizeRequests
//                                .antMatchers("/api/**").permitAll()
//                                .anyRequest().authenticated()
//                )
//                .oauth2ResourceServer(oauth2 -> oauth2
//                        .jwt(jwt -> jwt
//                                .jwtAuthenticationConverter(jwtConverter)
//                        )
//                );
//
//        return http.build();
//    }

//    private JwtAuthenticationConverter jwtAuthenticationConverter() {
//        JwtAuthenticationConverter jwtConverter = new JwtAuthenticationConverter();
//        jwtConverter.setJwtGrantedAuthoritiesConverter(jwt -> {
//            System.out.println("Received JWT: " + jwt.getTokenValue());
//            return new JwtGrantedAuthoritiesConverter().convert(jwt);
//        });
//        return jwtConverter;
//    }
//}