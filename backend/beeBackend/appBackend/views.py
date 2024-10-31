# views.py
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Recording
from .serializer import RecordingSerializer
import logging

logger = logging.getLogger('appBackend')  

class RecordingDetailView(APIView):
    # permission_classes = [permissions.IsAuthenticated]

    @swagger_auto_schema(
        operation_description="List all recordings ",
        responses={200: RecordingSerializer(many=True)}
    )
    def get(self, request, pk=None):
        if pk:
            recording = get_object_or_404(Recording, pk=pk, user=request.user)
            serializer = RecordingSerializer(recording)
        else:
            recordings = Recording.objects.filter(user=request.user)
            serializer = RecordingSerializer(recordings, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @swagger_auto_schema(
        operation_description="Create a new recording",
        request_body=RecordingSerializer,
        responses={201: RecordingSerializer}
    )
    def post(self, request):
        data = request.data.copy()
        data['user'] = request.user.id
        serializer = RecordingSerializer(data=data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @swagger_auto_schema(
        operation_description="Update an existing recording ",
        request_body=RecordingSerializer,
        responses={200: RecordingSerializer}
    )
    def put(self, request, pk):
        recording = get_object_or_404(Recording, pk=pk, user=request.user)
        serializer = RecordingSerializer(recording, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @swagger_auto_schema(
        operation_description="Delete an existing recording ",
        responses={204: 'No Content'}
    )
    def delete(self, request, pk):
        recording = get_object_or_404(Recording, pk=pk, user=request.user)
        recording.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
