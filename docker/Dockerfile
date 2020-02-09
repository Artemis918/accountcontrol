FROM openjdk
EXPOSE 8080
COPY kontospring.jar .
ENTRYPOINT ["java", "-jar", "kontospring.jar","-Dspring.profiles.active=kube"]