FROM nginx
RUN mkdir /usr/share/nginx/html/dist
COPY dist/ /usr/share/nginx/html/dist/
COPY nginx.conf /etc/nginx/nginx.conf
