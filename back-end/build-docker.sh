#!/bin/sh
set -eux

VERSION=$(./gradlew -q printVersion)
echo "Build version: " ${VERSION}

docker version
java -version

# 删除打包的中间产物
rm -rf docker/*.jar

#npm install --unsafe-perm=true --allow-root

if [[ ! -x "./gradlew" ]]; then
    chmod +x ./gradlew
fi

SERVICE_NAME=ts-hitpot-server
JAR_NAME=${SERVICE_NAME}-${VERSION}.jar
DOCKER_JAR_NAME=${SERVICE_NAME}.jar
DOCKER_NAME=usydapeng/${SERVICE_NAME}:${VERSION}

echo "********************************************************"
echo "Build ${SERVICE_NAME} jar package"
echo "********************************************************"

./gradlew clean bootJar

echo "********************************************************"
echo "Build ${DOCKER_NAME} docker image"
echo "********************************************************"
cp build/libs/${JAR_NAME} docker/${DOCKER_JAR_NAME}

docker build --platform=linux/amd64 -f docker/Dockerfile -t ${DOCKER_NAME} docker

docker push ${DOCKER_NAME}

# 删除打包的中间产物
rm -rf docker/*.jar
