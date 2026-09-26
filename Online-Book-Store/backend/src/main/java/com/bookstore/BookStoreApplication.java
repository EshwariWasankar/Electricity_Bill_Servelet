package com.bookstore;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class BookStoreApplication {
    public static void main(String[] args) {
        SpringApplication.run(BookStoreApplication.class, args);
        System.out.println("=================================================");
        System.out.println("🚀 Online Book Store Spring Boot Backend Started!");
        System.out.println("📡 REST Endpoints live on: http://localhost:8080/api");
        System.out.println("🍃 Connected to MongoDB: onlinebookstore");
        System.out.println("=================================================");
    }
}
