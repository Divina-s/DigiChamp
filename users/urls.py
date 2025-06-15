from django.urls import path
from .views import (
    CustomPasswordResetView,
    CustomPasswordResetConfirmView,
    RegisterView,
    CustomLoginView,
    LogoutView,
)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', CustomLoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('password-reset/', CustomPasswordResetView.as_view(), name='password_reset'),
    path('password-reset-confirm/', CustomPasswordResetConfirmView.as_view(), name='password_reset_confirm'),
]
