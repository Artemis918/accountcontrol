FROM arm64v8/eclipse-temurin:25-jre-alpine@sha256:6ecf9dc44dc6dba8e2ccd154687053a1f7b0e86f7e2ba04b548650538f5d1cc9
EXPOSE 8080
COPY accountcontrol.jar .
CMD ["java" ,"-Dspring.profiles.active=kube" , "-jar", "accountcontrol.jar"]
