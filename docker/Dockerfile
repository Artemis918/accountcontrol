FROM arm64v8/eclipse-temurin:24-jre-alpine@sha256:bdc001f77fd0dc9937ec1866b87c87d2563f1dd2829ccf981abf56c87c0f9ba1
EXPOSE 8080
COPY accountcontrol.jar .
CMD ["java" ,"-Dspring.profiles.active=kube" , "-jar", "accountcontrol.jar"]
