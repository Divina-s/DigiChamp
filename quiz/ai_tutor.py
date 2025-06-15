import os
import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure Gemini
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

def ask_ai_tutor(question, topic_name=None):
    prompt = f"You are an AI tutor. Help the student with this question: {question}"
    if topic_name:
        prompt += f" The topic is: {topic_name}."

    try:
        model = genai.GenerativeModel("models/gemini-1.5-pro-latest")
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        return f"Sorry, I couldn't answer your question because:\n\n{str(e)}"
