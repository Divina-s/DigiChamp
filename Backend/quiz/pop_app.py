# pop_app.py
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from quiz.models import Topic, Quiz, Question, Option

data = [
    {
        "topic": "Hardware Components and Their Functions",
        "questions": [
            {"question": "Which of these is the brain of the computer?",
             "options": ["Keyboard", "Mouse", "CPU", "Monitor"], "answer": "CPU"},
            {"question": "Which device is used to display information visually?",
             "options": ["Scanner", "Monitor", "Printer", "Hard Drive"], "answer": "Monitor"},
            {"question": "A mouse is mainly used for:",
             "options": ["Input", "Output", "Storage", "Processing"], "answer": "Input"},
            {"question": "Which device stores permanent data even when the computer is off?",
             "options": ["RAM", "Hard Disk", "CPU", "Monitor"], "answer": "Hard Disk"},
            {"question": "What does RAM stand for?",
             "options": ["Random Access Memory", "Read Access Memory", "Read and Monitor", "Run Any Machine"], "answer": "Random Access Memory"},
        ]
    },
    {
        "topic": "Internet Safety and Security",
        "questions": [
            {"question": "A strong password should include:",
             "options": ["Only your name", "Letters, numbers, and symbols", "Just numbers", "Only small letters"], "answer": "Letters, numbers, and symbols"},
            {"question": "What is phishing?",
             "options": ["Playing games online", "Sending fake messages to steal information", "Buying products on the internet", "A type of computer virus"], "answer": "Sending fake messages to steal information"},
            {"question": "Which of these is safe online behavior?",
             "options": ["Sharing your password with friends", "Using public Wi-Fi for banking", "Clicking on unknown links", "Using antivirus software"], "answer": "Using antivirus software"},
            {"question": "What does HTTPS in a website address mean?",
             "options": ["High Tech Password System", "Safe and Secure Website", "Hyper Text Transfer Protocol Secure", "Hidden Text Transfer Protocol"], "answer": "Hyper Text Transfer Protocol Secure"},
            {"question": "Which of these is an example of personal information you should protect online?",
             "options": ["Favorite color", "Date of birth", "Nickname", "Hobby"], "answer": "Date of birth"},
        ]
    },
    # ... keep all other topics the same ...
]

for topic_data in data:
    topic_name = topic_data["topic"]
    topic_obj, _ = Topic.objects.get_or_create(name=topic_name)
    print(f"Topic: {topic_name}")

    # Create a beginner-level quiz for this topic
    quiz_obj, _ = Quiz.objects.get_or_create(topic=topic_obj, title=f"{topic_name} Quiz", level="beginner")
    print(f"Quiz: {quiz_obj.title} (Level: {quiz_obj.level})")

    for q in topic_data["questions"]:
        question_text = q["question"]
        question_obj, _ = Question.objects.get_or_create(quiz=quiz_obj, text=question_text)
        print(f"Question: {question_text}")

        for option_text in q["options"]:
            is_correct = option_text == q["answer"]
            option_obj, created = Option.objects.get_or_create(
                question=question_obj,
                text=option_text,
                defaults={'is_correct': is_correct}
            )
            if created:
                print(f"Added option: {option_text} (Correct: {is_correct})")
