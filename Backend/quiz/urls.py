from django.urls import path
from .views import TopicsListView, QuizDetailView, SubmitAnswersView, AITutorView

urlpatterns = [
    path('topics/', TopicsListView.as_view(), name='topics-list'),
    path('quizzes/<int:quiz_id>/', QuizDetailView.as_view(), name='quiz-detail'),
    path('quizzes/<int:quiz_id>/submit/', SubmitAnswersView.as_view(), name='submit-answers'),
    path('ai-tutor/', AITutorView.as_view(), name='ai-tutor'),
]