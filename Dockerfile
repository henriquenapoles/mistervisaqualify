# Dockerfile Ultra Simples - Apenas Nginx + Arquivos Estáticos
FROM nginx:alpine

# Copiar arquivos estáticos
COPY static/ /usr/share/nginx/html/

# Copiar configuração nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expor porta 80
EXPOSE 80

# Nginx inicia automaticamente
CMD ["nginx", "-g", "daemon off;"]