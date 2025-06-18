from django.contrib import admin
from .models import Topic, Quiz, Question, Option, QuizAttempt

admin.site.register(Topic)
admin.site.register(Quiz)
admin.site.register(Question)
admin.site.register(Option)
admin.site.register(QuizAttempt)
