#!/bin/sh

# Function to create a superuser if it doesn't exist
create_superuser() {
  if ! python manage.py shell -c "from django.contrib.auth import get_user_model; User = get_user_model(); User.objects.filter(username='superadmin').exists()"; then
    echo "Creating superuser..."
    python manage.py createsuperuser --noinput --username superadmin --email admin@mdbee.com
    # Set the password for the superuser
    echo "Setting password for superuser..."
    echo "password@2024" | python manage.py shell -c "from django.contrib.auth import get_user_model; User = get_user_model(); user = User.objects.get(username='); user.set_password('password@2024'); user.save()"
    echo "Superuser created."
  else
    echo "Superuser already exists."
  fi
}



cd beeBackend
# Run migrations
python manage.py makemigrations accounts
python manage.py makemigrations appBackend
python manage.py migrate


#create_superuser
cd appBackend
pytest

cd ..
# Start the server
python manage.py runserver 0.0.0.0:8000
