FROM openjdk
EXPOSE 8080
COPY kontospring.jar .
CMD ["/usr/bin/java" ,"-Dspring.profiles.active=kube" , "-jar", "kontospring.jar"]
