package com.wicketlive;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class WicketLiveApplication {
    public static void main(String[] args) {
        SpringApplication.run(WicketLiveApplication.class, args);
    }
}
