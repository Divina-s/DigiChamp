import os
import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Configure the Gemini API key
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# Initialize the model (use gemini-pro for chat)
model = genai.GenerativeModel("gemini-pro")

def ask_ai_tutor(question, topic_name=None):
    try:
        prompt = f"You are an AI tutor. Help the student with this question: {question}"
        if topic_name:
            prompt += f" The topic is {topic_name}."

        response = model.generate_content(prompt)

        return response.text.strip()
    except Exception as e:
        return f"Sorry, I couldn't answer your question because:\n\n{str(e)}"
