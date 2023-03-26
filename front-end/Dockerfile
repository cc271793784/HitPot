FROM nginx

# 添加自定义配置文件
ADD ./nginx.conf /etc/nginx/conf.d/default.conf

COPY ./build /usr/share/nginx/html
