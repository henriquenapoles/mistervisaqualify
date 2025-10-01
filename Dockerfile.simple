# Dockerfile SUPER SIMPLES - Apenas Nginx servindo arquivos estáticos
FROM nginx:alpine

# Copiar arquivos estáticos para o Nginx
COPY static/ /usr/share/nginx/html/

# Expor porta 80
EXPOSE 80

# Nginx inicia automaticamente
CMD ["nginx", "-g", "daemon off;"]
