FROM nginx:stable-alpine
EXPOSE 80
COPY build/ /usr/share/nginx/html/frontend
