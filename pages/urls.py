from django.urls import path
from django.views.generic import TemplateView
from .views import (
    login_page,
    register_page,
    todo_list_page,
    TodoCreatePageView,
    TodoUpdatePageView,
    profile_page,
    change_password_page,
    forgot_password_page,
    reset_password_page
)

app_name = "pages"



urlpatterns = [

    path("login/",login_page,name="login-page"),

    path("register/",register_page,name="register-page"),

    path("todos/",todo_list_page,name="todo-page"),

    path("todos/create/",TodoCreatePageView,name="todo-create"),

    path("todos/<int:pk>/edit/",TodoUpdatePageView,name="todo_update"),

    path("profile/",profile_page,name="profile"),

    path("change-password/",change_password_page,name="change-password"),

    path("forgot-password/",forgot_password_page,name="forgot-password",),

    path("reset-password/<int:uid>/<str:token>/",reset_password_page,name="reset-password",),

]

