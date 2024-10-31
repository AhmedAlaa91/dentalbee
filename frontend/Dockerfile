# frontend/Dockerfile
FROM node:18

WORKDIR /app
COPY ./frontend/appfrontend/package.json /app/package.json
COPY ./frontend/appfrontend/package-lock.json /app/package-lock.json
COPY ./frontend/appfrontend /app



ENTRYPOINT ["/app/entrypoint_front.sh"]