from rest_framework import serializers
from .models import Topic, Quiz, Question, Option

class OptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Option
        fields = ['id', 'text']

class QuestionSerializer(serializers.ModelSerializer):
    options = OptionSerializer(many=True, read_only=True)

    class Meta:
        model = Question
        fields = ['id', 'text', 'options']

class QuizSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True, source='questions')  # using related_name='questions'

    class Meta:
        model = Quiz
        fields = ['id', 'title', 'questions']

class TopicSerializer(serializers.ModelSerializer):
    quizzes = QuizSerializer(many=True, source='quiz_set')  # this is fine unless you added a related_name

    class Meta:
        model = Topic
        fields = ['id', 'name', 'quizzes']
