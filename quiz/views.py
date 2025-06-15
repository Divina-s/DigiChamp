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

class TopicsListView(APIView):
    def get(self, request):
        topics = Topic.objects.all()
        serializer = TopicSerializer(topics, many=True)
        return Response(serializer.data)

class QuizDetailView(APIView):
    def get(self, request, quiz_id):
        try:
            quiz = Quiz.objects.get(id=quiz_id)
        except Quiz.DoesNotExist:
            return Response({"error": "Quiz not found"}, status=status.HTTP_404_NOT_FOUND)
        serializer = QuizSerializer(quiz)
        return Response(serializer.data)

class SubmitSingleAnswerView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        question_id = request.data.get('question_id')
        selected_option_id = request.data.get('selected_option_id')

        if not question_id or not selected_option_id:
            return Response({"error": "Question ID and selected option ID are required."}, status=400)

        try:
            question = Question.objects.get(id=question_id)
            selected_option = Option.objects.get(id=selected_option_id, question=question)
        except Question.DoesNotExist:
            return Response({"error": "Question not found."}, status=404)
        except Option.DoesNotExist:
            return Response({"error": "Option not found for this question."}, status=404)

        # Save user's answer
        Answer.objects.update_or_create(
            user=user,
            question=question,
            defaults={'selected_option': selected_option}
        )

        # Check correctness
        is_correct = selected_option.is_correct

        # Get the correct option(s) for this question to send back
        correct_options = question.options.filter(is_correct=True)
        correct_answers = [{"id": opt.id, "text": opt.text} for opt in correct_options]

        return Response({
            "question_id": question.id,
            "is_correct": is_correct,
            "correct_answers": correct_answers,
            "message": "Correct!" if is_correct else "Incorrect.",
        })

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
