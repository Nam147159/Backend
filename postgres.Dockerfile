FROM postgres:16.4

COPY ./config/init.sql /docker-entrypoint-initdb.d/
