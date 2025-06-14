from rest_framework import serializers
from .models import Topic, Quiz, Question, Answer

class AnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Answer
        fields = ['id', 'text']

class QuestionSerializer(serializers.ModelSerializer):
    answers = AnswerSerializer(many=True, source='answer_set')
    class Meta:
        model = Question
        fields = ['id', 'text', 'answers']

class QuizSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True, source='question_set')
    class Meta:
        model = Quiz
        fields = ['id', 'title', 'questions']

class TopicSerializer(serializers.ModelSerializer):
    quizzes = QuizSerializer(many=True, source='quiz_set')
    class Meta:
        model = Topic
        fields = ['id', 'name', 'quizzes']
