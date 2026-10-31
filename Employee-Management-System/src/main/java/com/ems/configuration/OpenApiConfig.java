
package com.ems.configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.security.SecurityRequirement;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI employeeManagementAPI() {

        return new OpenAPI()
                .info(new Info()
                        .title("Employee Management System API")
                        .description("REST API for Employee Management System")
                        .version("1.0")
                        .contact(new Contact()
                                .name("Anjali Pandey")
                                .email("your-email@example.com"))
                        .license(new License()
                                .name("Apache 2.0")))

                .components(new Components()
                        .addSecuritySchemes("Bearer Authentication",
                                new SecurityScheme()
                                        .type(SecurityScheme.Type.HTTP)
                                        .scheme("bearer")
                                        .bearerFormat("JWT")))

                .addSecurityItem(
                        new SecurityRequirement()
                                .addList("Bearer Authentication"));
    }
}
