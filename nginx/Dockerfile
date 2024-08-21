FROM nginx:1.27.0-alpine

COPY ./nginx.conf /etc/nginx/nginx.conf
COPY ./conf.d /etc/nginx/conf.d

RUN mkdir -p /var/log/nginx
RUN mkdir -p /app/{nextjs_static,nextjs_public}
