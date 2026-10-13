package com.nibl.ticketing;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class NrbTicketingToolApplication {

	public static void main(String[] args) {
		SpringApplication.run(NrbTicketingToolApplication.class, args);
	}

}
