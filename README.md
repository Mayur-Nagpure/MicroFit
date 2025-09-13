MicroFit: AI-Powered Microservices Fitness Application
[](https://opensource.orgit?

MicroFit is a full-stack fitness application built using a modern microservices architecture. It features AI-driven personalized workout recommendations, securely tracks user activities, and leverages asynchronous messaging for a scalable and resilient system. The backend is powered by Spring Boot microservices, and the frontend is developed with React.


Why I Built This Project
This project was created to demonstrate how a modern microservices architecture can be effectively applied in the fitness domain. The primary goal was to integrate AI to offer personalized fitness guidance and build a system that is both scalable and maintainable, addressing the common limitations of monolithic fitness applications.

Problem Statement
Most traditional fitness apps lack a modular architecture and real-time, AI-powered recommendations. There is a growing need for an intelligent, scalable system that can provide personal fitness insights based on detailed user activity data, a challenge that microservices are well-suited to solve.

✨ Key Features
Independent Microservices: Separate, decoupled services for user management, activity tracking, and AI recommendations.

AI-Powered Guidance: Utilizes Google Gemini API keys to generate exercise analysis and personalized fitness recommendations.

Secure Authentication: Implemented with Keycloak using OAuth2 and JWT to secure the entire application.

Asynchronous Communication: Employs RabbitMQ for reliable and scalable asynchronous messaging between services.

Decoupled Data Management: Each microservice has its own database (MySQL, MongoDB) to ensure loose coupling.

Responsive Frontend: A smooth and responsive user experience built with React.

Centralized Management: Service discovery, routing, and configuration are handled by Eureka and Spring Cloud Config.

💻 Technologies Used (Tech Stack)
Category	Technology
Backend	Java, Spring Boot
Frontend	React, JavaScript
Asynchronous Messaging	RabbitMQ
Security	Keycloak, OAuth2, JWT
Databases	MySQL, MongoDB
AI Integration	Google Gemini API
Microservice Management	Spring Cloud (Eureka Service Discovery, API Gateway, Config Server)
Containerization	Docker, Docker Compose
🚀 Getting Started
Prerequisites
Git

Docker and Docker Compose

Java JDK (17 or higher)

Node.js and npm (for the frontend)

Google Gemini API Key

Installation & Setup
Clone the repository:

text
git clone https://github.com/your-username/MicroFit.git
cd MicroFit
Configure API Keys:
Add your Google Gemini API key to the configuration file for the aiservice.

Build the Java microservices:
Navigate into each microservice directory and build the project.

text
# Example with Maven
mvn clean package -DskipTests
Run with Docker Compose:
This command will build the Docker images and start all the containers.

text
docker-compose up --build
Access the application:

Eureka Dashboard: http://localhost:8761

Keycloak Admin Console: http://localhost:8181

Frontend Application: http://localhost:3000

🧠 Learning Outcomes
Gained hands-on experience building scalable, end-to-end microservices-based applications.

Successfully integrated AI services with backend logic using asynchronous messaging patterns.

Implemented robust, token-based security using OAuth2 and Keycloak in a distributed environment.

Developed a responsive frontend that communicates effectively with multiple backend microservices via an API Gateway.

Mastered service discovery, routing, and centralized configuration management in a distributed system.

🛠️ Challenges Overcome
Coordinating Communication: Engineered a hybrid communication model, using both synchronous (REST) and asynchronous (RabbitMQ) patterns to ensure data consistency and service availability.

Securing Microservices: Established a secure authentication flow where the API Gateway validates JWT tokens issued by Keycloak before routing requests to downstream services.

Effective AI Integration: Designed a workflow to securely manage API keys and efficiently call the third-party Gemini API without blocking critical user-facing operations.

Distributed System Management: Utilized Docker Compose to orchestrate the multi-container environment, managing service dependencies and network configurations.

⚠️ Limitations
The frontend UI is functional but has room for aesthetic and UX enhancements.

Fitness metrics are basic and could be expanded to include pace, distance, and heart rate from sensor data.

The system relies on an active internet connection for its AI-powered features.

🔮 Future Enhancements
Enhanced Metrics: Integrate with wearable fitness devices to track real-time metrics like pace and heart rate.

Improved UI/UX: Redesign the frontend with interactive data visualizations and a more polished user interface.

Advanced AI Models: Extend AI capabilities for more comprehensive fitness and wellness insights.

Cloud-Native Deployment: Migrate the deployment from Docker Compose to a Kubernetes cluster for better scalability and resilience.
