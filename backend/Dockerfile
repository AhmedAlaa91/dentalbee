FROM python:3.10

WORKDIR /app
COPY ./backend/beeBackend/requirements.txt /app/requirements.txt
RUN pip install -r requirements.txt

# Copy the entire backend folder to /app
COPY ./backend /app

COPY ./backend/entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

ENV DJANGO_SETTINGS_MODULE=beeBackend.settings

ENTRYPOINT ["/app/entrypoint.sh"]