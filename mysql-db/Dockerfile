# Dockerfile para nuestra base de datos personalizada

# Empezamos desde la imagen oficial de MySQL
FROM mysql:8.0

# Copiamos nuestro archivo de configuración personalizado
# dentro del directorio de configuraciones de la imagen.
# MySQL leerá este archivo al arrancar.
COPY custom.cnf /etc/mysql/conf.d/custom.cnf