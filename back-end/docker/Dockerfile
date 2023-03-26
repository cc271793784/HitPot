FROM usydapeng/openjdk-debian-jre-11-ffmpeg-20230325 as builder

ENV SERVER_NAME=ts-hitpot-server
ENV PORT=8080

WORKDIR /app
COPY ./${SERVER_NAME}.jar /app

RUN java -Djarmode=layertools -jar ${SERVER_NAME}.jar extract

FROM usydapeng/openjdk-debian-jre-11-ffmpeg-20230325

LABEL description="ts-hitpot-server image"

ENV TZ=Asia/Shanghai

RUN mkdir -p /ts-hitpot-server
RUN mkdir -p /ts-hitpot-server/logs
RUN mkdir -p /ts-hitpot-server/upload/image
RUN mkdir -p /ts-hitpot-server/upload/video

WORKDIR /ts-hitpot-server

COPY --from=builder app/dependencies/ ./
COPY --from=builder app/snapshot-dependencies/ ./
COPY --from=builder app/spring-boot-loader/ ./
COPY --from=builder app/application/ ./

EXPOSE ${PORT}

CMD java -Xmx${JVM_MAX_MEMORY} -Xss1M -server -Djava.security.egd=file:/dev/./urandom \
    -XX:+HeapDumpOnOutOfMemoryError -XX:HeapDumpPath=/ts-hitpot-server/logs \
    -Dspring.profiles.active=${SPRING_PROFILE} \
    -Dfile.encoding=UTF-8 \
    -Duser.timezone=GMT+8 \
    org.springframework.boot.loader.JarLauncher --server.port=${PORT}
