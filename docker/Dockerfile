FROM openjdk
EXPOSE 8080
COPY kontospring.jar .
ENTRYPOINT ["java", "-jar", "kontospring.jar","--spring.datasource.url=jdbc:postgresql://postgres.balsen.loc:5434/kontoprax"] 

