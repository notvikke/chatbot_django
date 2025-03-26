import os
import google.generativeai as genai
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from django.shortcuts import render
import time
from django.http import JsonResponse

GEMINI_API_KEY = os.environ.get('GEMINI_API_KEY')

# 2. Get the Model Name from the environment, providing a default
DEFAULT_MODEL = "gemini-1.5-pro-latest" # Keep your desired default here
MODEL_NAME = os.environ.get('GEMINI_MODEL_NAME', DEFAULT_MODEL)

# 3. Configure Gemini, but only if the key exists
if not GEMINI_API_KEY:
    print("ERROR: Gemini API Key (GEMINI_API_KEY) not found in environment variables.")
    # Depending on your application structure, you might want to:
    # - raise Exception("Gemini API Key not configured.")
    # - Set a flag indicating the service is unavailable
    # For now, we just print an error. Calls using 'genai' will likely fail later.
else:
    try:
        genai.configure(api_key=GEMINI_API_KEY)
        print(f"Gemini API configured successfully. Using model: {MODEL_NAME}")
    except Exception as e:
        print(f"ERROR: Failed to configure Gemini API: {e}")
        # Handle the configuration error appropriately

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
