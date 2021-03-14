FROM arm64v8/openjdk:11.0-jre-slim-buster
EXPOSE 8080
COPY kontospring.jar .
CMD ["java" ,"-Dspring.profiles.active=kube" , "-jar", "kontospring.jar"]
