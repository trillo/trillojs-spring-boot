package io.trillo.example;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import io.trillo.example.datasource.MemoryDataSource;

@SpringBootApplication
public class TrilloExampleServer {
 
  private static final Logger logger = LoggerFactory.getLogger(TrilloExampleServer.class);
  
	public static void main(String[] args) {
	  MemoryDataSource.createInstance();
		SpringApplication app = new SpringApplication(TrilloExampleServer.class);
		app.run(args);
		String workingDir = System.getProperty("user.dir");
    logger.info("Current working directory : " + workingDir);
	}
}
