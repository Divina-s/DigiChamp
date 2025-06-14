import os
import openai

# Load API key from environment variable
openai.api_key = os.getenv("OPENAI_API_KEY")

def ask_ai_tutor(question, topic_name=None):
    """
    Sends a prompt to OpenAI's API and returns a helpful answer.
    """
    prompt = f"You are an AI tutor. Help the student with this question: {question}"
    if topic_name:
        prompt += f" The topic is: {topic_name}."

    try:
        response = openai.ChatCompletion.create(
            model="gpt-4o-mini",  # or "gpt-4" or whichever model you have access to
            messages=[
                {"role": "system", "content": "You are a helpful AI tutor."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=150,
            temperature=0.7,
        )
        answer = response.choices[0].message.content.strip()
        return answer
    except Exception as e:
        return f"Sorry, I couldn't answer your question because: {str(e)}"
