FROM arm64v8/eclipse-temurin:18-jre@sha256:ec4a49050e01ca2ea651bbe42b5a8e05a1b20cebd7fcf51bc511a90aba5020f6
EXPOSE 8080
COPY accountcontrol.jar .
CMD ["java" ,"-Dspring.profiles.active=kube" , "-jar", "accountcontrol.jar"]
