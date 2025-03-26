import google.generativeai as genai
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from django.shortcuts import render
import time
from django.http import JsonResponse

# Configure Google Gemini API
API_KEY = "AIzaSyCkvlGlVne6pS7yGsf_SMfQdqzLGq6mNd4"  # Replace with your actual API key
genai.configure(api_key=API_KEY)

MODEL_NAME = "gemini-1.5-pro-latest"  # Change if needed

def generate_response(user_input):
    try:
        model = genai.GenerativeModel(MODEL_NAME)
        response = model.generate_content(user_input)
        return response.text if response else "Sorry, I couldn't generate a response."
    except Exception as e:
        return f"Error: {str(e)}"

@csrf_exempt  # Disable CSRF for simplicity (you can enable it properly later)
def chatbot_api(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            user_input = data.get("message", "")
            bot_response = generate_response(user_input)
            return JsonResponse({"response": bot_response})
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON format"}, status=400)
    return JsonResponse({"error": "Invalid request method"}, status=405)

def home(request):
    return render(request, 'chatbot/home.html', {
        "dark_mode": False  # Default theme mode
    })


def chatbot_response(request):
    if request.method == "POST":
        user_message = request.POST.get("message", "")
        
        # Simulate bot processing time
        time.sleep(2)  # Delay for 2 seconds
        
        bot_response = f"Echo: {user_message}"  # Replace with your AI logic
        
        return JsonResponse({"message": bot_response})
