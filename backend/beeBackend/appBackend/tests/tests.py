# tests/test_views.py
import pytest
from rest_framework import status
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model
from ..models import Recording
from ..serializer import RecordingSerializer
from django.core.files.uploadedfile import SimpleUploadedFile
User = get_user_model()

@pytest.fixture
def api_client():
    return APIClient()

@pytest.fixture
def user(db):
    return User.objects.create_user(username='testuser', password='testpass')

@pytest.fixture
def authenticated_client(api_client, user):
    api_client.force_authenticate(user=user)
    return api_client

@pytest.fixture
def valid_recording_data():
    file_content = b"This is a test file."
    file = SimpleUploadedFile("test_file.mp3", file_content, content_type="audio/mpeg")
    return {
        'title': 'Test Recording',
        'description': 'This is a test recording.',
        'file': file, 
    }

@pytest.mark.django_db
def test_create_recording_success(authenticated_client, valid_recording_data):
    response = authenticated_client.post('http://localhost:8000/api/recordings/', data=valid_recording_data, format='multipart')
    print(response.data)
    assert response.status_code == status.HTTP_201_CREATED
    assert 'id' in response.data  # Check if the response contains the ID of the new recording
    assert response.data['title'] == valid_recording_data['title']

@pytest.mark.django_db
def test_create_recording_invalid(authenticated_client):
    # Example of invalid data (missing required fields)
    invalid_data = {
        'description': 'This recording has no title.',
    }
    
    response = authenticated_client.post('http://localhost:8000/api/recordings/', data=invalid_data, format='json')
    
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert 'title' in response.data  # Check if the error message indicates the missing field
