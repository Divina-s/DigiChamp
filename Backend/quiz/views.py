from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Topic, Quiz, Question
from .serializers import TopicSerializer, QuizSerializer, QuestionSerializer

class TopicsListView(APIView):
    def get(self, request):
        try:
            topics = Topic.objects.all()
            serializer = TopicSerializer(topics, many=True)
            return Response(serializer.data)
        except Exception as e:
            return Response({"error": str(e)}, status=500)

class QuizDetailView(APIView):
    def get(self, request, quiz_id):
        try:
            quiz = Quiz.objects.get(id=quiz_id)
        except Quiz.DoesNotExist:
            return Response({"error": "Quiz not found"}, status=status.HTTP_404_NOT_FOUND)
        serializer = QuizSerializer(quiz)
        return Response(serializer.data)

class QuizQuestionsByTopicAndLevel(APIView):
    def get(self, request):
        topic_id = request.GET.get('topic_id')
        level = request.GET.get('level', 'beginner')  # default to beginner

        if not topic_id:
            return Response({"error": "Topic ID is required."}, status=400)

        try:
            # Case-insensitive search on level
            quiz = Quiz.objects.filter(topic_id=topic_id, level__iexact=level).first()
            if not quiz:
                return Response({"error": "No quiz found for this topic and level."}, status=404)

            questions = quiz.questions.all()
            serializer = QuestionSerializer(questions, many=True)
            return Response(serializer.data)
        except Exception as e:
            return Response({"error": str(e)}, status=500)


from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Question, Option

class SubmitSingleAnswerView(APIView):
    def post(self, request):
        question_id = request.data.get("question_id")
        selected_option_id = request.data.get("selected_option_id")

        if not question_id or not selected_option_id:
            return Response({"error": "question_id and selected_option_id are required"}, status=400)

        try:
            question = Question.objects.get(id=question_id)
            selected_option = question.options.get(id=selected_option_id)

            is_correct = selected_option.is_correct

            # You can also save the answer if you have a model to track user answers
            return Response({"correct": is_correct}, status=200)

        except Question.DoesNotExist:
            return Response({"error": "Question not found"}, status=404)
        except Option.DoesNotExist:
            return Response({"error": "Option not found"}, status=404)
