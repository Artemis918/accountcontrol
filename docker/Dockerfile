FROM openjdk
EXPOSE 8080
COPY kontospring.jar .
ENTRYPOINT ["java" ,"-Dspring.profiles.active=kube" , "-jar", "kontospring.jar"]
