# ---- Stage 1: compile SCSS -> assets/css/style.css ----
FROM node:22-alpine AS build
WORKDIR /app

COPY package.json ./
RUN npm install

COPY . .
RUN npm run build

# ---- Stage 2: serve static files with nginx ----
FROM nginx:1.27-alpine

# Only ship what the site needs (no node_modules, scss sources, or PHP)
COPY --from=build /app/*.html /usr/share/nginx/html/
COPY --from=build /app/assets /usr/share/nginx/html/assets
RUN rm -rf /usr/share/nginx/html/assets/scss /usr/share/nginx/html/assets/php

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
