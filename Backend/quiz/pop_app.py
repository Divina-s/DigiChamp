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
    {
        "topic": "File Management and Storage",
        "questions": [
            {"question": "Which of the following is a storage device?",
             "options": ["Printer", "Flash Drive", "Mouse", "Keyboard"], "answer": "Flash Drive"},
            {"question": "The process of arranging files into folders is called:",
             "options": ["Formatting", "File Management", "Downloading", "Copying"], "answer": "File Management"},
            {"question": "Which of these is the fastest way to search for a file on your computer?",
             "options": ["Open every folder", "Use the Search function", "Restart the computer", "Check the printer"], "answer": "Use the Search function"},
            {"question": "Which of the following is a cloud storage service?",
             "options": ["Google Drive", "MS Word", "Excel", "Antivirus"], "answer": "Google Drive"},
            {"question": "Deleting a file sends it to:",
             "options": ["Recycle Bin", "CPU", "Monitor", "Desktop background"], "answer": "Recycle Bin"},
        ]
    },
    {
        "topic": "Understanding Software and Applications",
        "questions": [
            {"question": "Which of the following is an example of system software?",
             "options": ["Microsoft Word", "Windows", "Facebook", "WhatsApp"], "answer": "Windows"},
            {"question": "Which is an example of application software?",
             "options": ["Operating System", "Google Chrome", "CPU", "Keyboard"], "answer": "Google Chrome"},
            {"question": "What is the main function of an operating system?",
             "options": ["To manage hardware and software", "To play music", "To print documents", "To store files permanently"], "answer": "To manage hardware and software"},
            {"question": "Which software is best for typing letters?",
             "options": ["Excel", "Word", "PowerPoint", "Paint"], "answer": "Word"},
            {"question": "Which software is used to create slideshows?",
             "options": ["Word", "PowerPoint", "Excel", "Access"], "answer": "PowerPoint"},
        ]
    },
    {
        "topic": "Computer Ethics",
        "questions": [
            {"question": "Which of the following is good computer behavior?",
             "options": ["Plagiarizing online work", "Respecting others’ privacy", "Spreading fake news", "Copying software illegally"], "answer": "Respecting others’ privacy"},
            {"question": "Which is an example of unethical computer use?",
             "options": ["Using licensed software", "Cyberbullying", "Protecting your password", "Respecting copyright"], "answer": "Cyberbullying"},
            {"question": "Copyright protects:",
             "options": ["Hardware devices", "Original creative works", "Internet browsing", "Operating systems only"], "answer": "Original creative works"},
            {"question": "Downloading software without paying is called:",
             "options": ["Hacking", "Piracy", "Security", "Cloud storage"], "answer": "Piracy"},
            {"question": "Which of these is a responsibility of a digital citizen?",
             "options": ["To harass others online", "To share harmful content", "To use technology responsibly", "To ignore internet rules"], "answer": "To use technology responsibly"},
        ]
    },
    {
        "topic": "Google Workspace",
        "questions": [
            {"question": "Which Google tool is used for creating documents online?",
             "options": ["Google Sheets", "Google Docs", "Google Slides", "Gmail"], "answer": "Google Docs"},
            {"question": "Google Sheets is mainly used for:",
             "options": ["Making presentations", "Sending emails", "Working with data and numbers", "Watching videos"], "answer": "Working with data and numbers"},
            {"question": "Which of these tools is best for making online presentations?",
             "options": ["Google Docs", "Google Drive", "Google Slides", "Gmail"], "answer": "Google Slides"},
            {"question": "Files in Google Drive can be:",
             "options": ["Shared with others", "Only kept private", "Never accessed again", "Deleted only by Google"], "answer": "Shared with others"},
            {"question": "Gmail is mainly used for:",
             "options": ["Storing files", "Sending and receiving emails", "Drawing pictures", "Playing games"], "answer": "Sending and receiving emails"},
        ]
    },
    {
        "topic": "Basic Computer Operations",
        "questions": [
            {"question": "Which button is used to start a computer?",
             "options": ["Enter", "Power", "Escape", "Shift"], "answer": "Power"},
            {"question": "Which device shows what you are doing on the computer?",
             "options": ["Keyboard", "CPU", "Monitor", "Mouse"], "answer": "Monitor"},
            {"question": "To copy a file, you use the shortcut:",
             "options": ["Ctrl + P", "Ctrl + C", "Ctrl + V", "Ctrl + X"], "answer": "Ctrl + C"},
            {"question": "Which device is used to type letters into the computer?",
             "options": ["Monitor", "Mouse", "Keyboard", "Speaker"], "answer": "Keyboard"},
            {"question": "Restarting a computer means:",
             "options": ["Turning it off completely", "Turning it off and on again", "Shutting it down only", "Installing a new program"], "answer": "Turning it off and on again"},
        ]
    },
]

for topic_data in data:
    topic_name = topic_data["topic"]
    topic_obj, created = Topic.objects.get_or_create(name=topic_name)
    print(f"{'Created' if created else 'Exists'} topic: {topic_name}")

    # Create a default quiz for this topic
    quiz_obj, created = Quiz.objects.get_or_create(topic=topic_obj, title=f"{topic_name} Quiz")
    print(f"{'Created' if created else 'Exists'} quiz: {quiz_obj.title}")

    for q in topic_data["questions"]:
        question_text = q["question"]
        question_obj, created = Question.objects.get_or_create(quiz=quiz_obj, text=question_text)
        print(f"{'Created' if created else 'Exists'} question: {question_text}")

        for option_text in q["options"]:
            is_correct = option_text == q["answer"]
            option_obj, created = Option.objects.get_or_create(question=question_obj, text=option_text, is_correct=is_correct)
            if created:
                print(f"Added option: {option_text} (Correct: {is_correct})")
