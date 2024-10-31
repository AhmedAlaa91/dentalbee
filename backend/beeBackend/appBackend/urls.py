from django.urls import path
from .views import RecordingDetailView

urlpatterns = [
    path('recordings/', RecordingDetailView.as_view()),  # List and Create
    path('recordings/<int:pk>/', RecordingDetailView.as_view()),  # Retrieve, Update, Delete
]