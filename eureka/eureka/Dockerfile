# Build stage: use Maven + OpenJDK 17 to build the app
FROM maven:3.8.7-eclipse-temurin-17 AS builder
WORKDIR /app

# Copy source code and build the jar (skip tests for faster build)
COPY .. .
RUN mvn clean package -DskipTests

# Runtime stage: use lightweight openjdk 17 image
FROM openjdk:17-slim
WORKDIR /app

# Copy the built jar from the builder stage
COPY --from=builder /app/target/*.jar app.jar

# Expose Eureka server port (8761)
EXPOSE 8761

# Run the Spring Boot app with the Docker-specific profile name if you have one
ENTRYPOINT ["java", "-jar", "/app/app.jar", "--spring.config.name=eureka-docker"]
