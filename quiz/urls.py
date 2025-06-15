from django.urls import path
from .views import TopicsListView, QuizDetailView,AITutorView, QuizQuestionsByTopicAndLevel,SubmitSingleAnswerView

urlpatterns = [
    path('topics/', TopicsListView.as_view(), name='topics-list'),
    path('quizzes/<int:quiz_id>/', QuizDetailView.as_view(), name='quiz-detail'),
    path('ai-tutor/', AITutorView.as_view(), name='ai-tutor'),
    path('quiz/questions/', QuizQuestionsByTopicAndLevel.as_view(), name='quiz-by-topic-level'),
    path('quiz/submit-answer/', SubmitSingleAnswerView.as_view(), name='submit-single-answer'),
]