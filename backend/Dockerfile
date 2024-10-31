FROM python:3.10

WORKDIR /app
COPY ./backend/beeBackend/requirements.txt /app/requirements.txt
RUN pip install -r requirements.txt

#RUN dos2unix ./backend/entrypoint.sh
# Copy the entire backend folder to /app
COPY ./backend /app

#RUN apt-get update && apt-get install -y dos2unix && dos2unix /app/entrypoint.sh

RUN chmod +x /app/entrypoint_back.sh

ENV DJANGO_SETTINGS_MODULE=beeBackend.settings

ENTRYPOINT ["/app/entrypoint_back.sh"]