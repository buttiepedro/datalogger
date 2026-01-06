# ETAPA 1: Construcción (Build)
# Usamos 'alpine' que es una versión muy ligera de Linux
FROM node:20-alpine as build-stage

WORKDIR /app

COPY package*.json ./

# 'npm ci' es mejor que 'npm install' para producción:
# respeta estrictamente el package-lock.json y es más rápido.
RUN npm ci

COPY . .

# Compilamos la aplicación.
# Esto genera una carpeta 'dist' (en Vite) o 'build' (en CRA) con los archivos estáticos.
RUN npm run build

# --------------------------------------------------------

# ETAPA 2: Servidor de Producción (Nginx)
FROM nginx:alpine as production-stage

# Copiamos los archivos compilados de la etapa anterior a la carpeta de Nginx
# NOTA: Si usas 'Create React App' cambia /app/dist por /app/build
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Copiamos una configuración personalizada de Nginx (ver abajo)
# Esto es vital para que funcionen las rutas de React/Vue (SPA)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]