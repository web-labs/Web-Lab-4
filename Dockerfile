FROM openjdk:11-jdk as build

WORKDIR /usr/src/app

COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .

COPY src src

RUN chmod +x mvnw
RUN ./mvnw package -DskipTests

FROM openjdk:11-jre-slim

WORKDIR /usr/app

COPY --from=build /usr/src/app/target/*.jar app.jar

EXPOSE 8081

CMD ["java", "-jar", "app.jar"]
