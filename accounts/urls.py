from django.urls import path

from .views import RegisterView,MeView,LoginView,ChangePasswordView,LogoutView
urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),

    path("login/", LoginView.as_view(), name="login"),

    path("me/", MeView.as_view(), name="me"),

    path("change-password/",ChangePasswordView.as_view(),name="change-password",),

    path("logout/",LogoutView.as_view(),name="logout",),
]