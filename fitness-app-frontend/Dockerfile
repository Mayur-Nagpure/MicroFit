# Build step
FROM node:18 AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
ARG REACT_APP_API_BASE=http://localhost:8080/api
RUN REACT_APP_API_BASE=$REACT_APP_API_BASE npm run build

# Production step: serve with nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
