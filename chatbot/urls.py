from django.urls import path
from . import views  # Import views from the same directory

urlpatterns = [
    path('', views.home, name='home'),  # Home page
    path('api/', views.chatbot_api, name='chatbot_api'),  # Chatbot API endpoint
]
