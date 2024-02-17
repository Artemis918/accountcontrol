#!/bin/bash
./gradlew build
cp build/libs/accountcontrol.jar docker
docker build -t gitlab.balsen.loc:4901/balsen/accountcontrol/accountcontrol:latest docker
docker push gitlab.balsen.loc:4901/balsen/accountcontrol/accountcontrol:latest
k9s
