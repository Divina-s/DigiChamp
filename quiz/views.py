from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .models import Topic, Quiz, Answer, UserLevel
from .serializers import TopicSerializer, QuizSerializer

def get_level_from_score(score):
    if score >= 80:
        return "Advanced"
    elif score >= 50:
        return "Intermediate"
    else:
        return "Beginner"

import logging

logger = logging.getLogger(__name__)

class TopicsListView(APIView):
    def get(self, request):
        try:
            logger.info("Fetching all topics")
            topics = Topic.objects.all()
            serializer = TopicSerializer(topics, many=True)
            logger.info(f"Serialized {len(serializer.data)} topics")
            return Response(serializer.data)
        except Exception as e:
            logger.error(f"Error in TopicsListView: {e}")
            return Response({"error": str(e)}, status=500)

class QuizDetailView(APIView):
    def get(self, request, quiz_id):
        try:
            quiz = Quiz.objects.get(id=quiz_id)
        except Quiz.DoesNotExist:
            return Response({"error": "Quiz not found"}, status=status.HTTP_404_NOT_FOUND)
        serializer = QuizSerializer(quiz)
        return Response(serializer.data)

import logging
logger = logging.getLogger(__name__)

class SubmitSingleAnswerView(APIView):
    def post(self, request, question_id):
        selected_option_id = request.data.get("selected_option_id")
        logger.info(f"Selected Option ID: {selected_option_id}")
        logger.info(f"Question ID: {question_id}")

        if selected_option_id is None:
            return Response({"error": "Option ID not provided."}, status=400)

        try:
            question = Question.objects.get(id=question_id)
        except Question.DoesNotExist:
            logger.warning("Question not found.")
            return Response({"error": "Question not found."}, status=404)

        try:
            selected_option = question.options.get(id=selected_option_id)
        except Option.DoesNotExist:
            logger.warning("Invalid option for this question.")
            return Response({"error": "Invalid option for this question."}, status=404)

        is_correct = selected_option.is_correct

        # Save answer
        Answer.objects.create(
            question=question,
            selected_option=selected_option,
            is_correct=is_correct
        )

        logger.info("Answer created successfully.")

        return Response({"message": "Answer submitted successfully.", "is_correct": is_correct})

from rest_framework.permissions import IsAuthenticated
from .ai_tutor import ask_ai_tutor
from .models import Topic
# Remove or fix this line in quiz/views.py
from .models import Topic, Quiz ,UserLevel


class AITutorView(APIView):
    

    def post(self, request):
        question = request.data.get("question")
        topic_id = request.data.get("topic_id")

        if not question:
            return Response({"error": "Question is required."}, status=400)

        topic_name = None
        if topic_id:
            try:
                topic = Topic.objects.get(id=topic_id)
                topic_name = topic.name
            except Topic.DoesNotExist:
                pass

        answer = ask_ai_tutor(question, topic_name)
        return Response({"answer": answer})
    
# views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Quiz, Question
from .serializers import QuestionSerializer

class QuizQuestionsByTopicAndLevel(APIView):
    def get(self, request):
        topic_id = request.GET.get('topic_id')
        level = request.GET.get('level', '').lower()

        if not topic_id or not level:
            return Response({"error": "Topic ID and level are required."}, status=400)

        try:
            quiz = Quiz.objects.filter(topic_id=topic_id, level=level).first()
            if not quiz:
                return Response({"error": "No quiz found for this topic and level."}, status=404)

            questions = quiz.questions.all()
            serializer = QuestionSerializer(questions, many=True)
            return Response(serializer.data)

        except Exception as e:
            return Response({"error": str(e)}, status=500)
