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

class SubmitAnswersView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, quiz_id):
        user_answers = request.data.get("answers", {})
        correct_count = 0
        total_questions = 0

        try:
            quiz = Quiz.objects.get(id=quiz_id)
        except Quiz.DoesNotExist:
            return Response({"error": "Quiz not found"}, status=status.HTTP_404_NOT_FOUND)

        for question in quiz.questions.all():
            total_questions += 1
            selected_answer_id = user_answers.get(str(question.id))
            if selected_answer_id:
                try:
                    selected_answer = Answer.objects.get(id=selected_answer_id)
                    if selected_answer.is_correct:
                        correct_count += 1
                except Answer.DoesNotExist:
                    pass

        score = (correct_count / total_questions) * 100 if total_questions else 0
        level = get_level_from_score(score)

        user = request.user
        user_level, created = UserLevel.objects.update_or_create(
            user=user,
            topic=quiz.topic,
            defaults={'level': level}
        )

        return Response({
            "total_questions": total_questions,
            "correct_answers": correct_count,
            "score_percentage": score,
            "assigned_level": level
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