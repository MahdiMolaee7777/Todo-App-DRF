from django.urls import path

from .views import RegisterView,MeView,LoginView,ChangePasswordView,LogoutView,UserInfoAPIView,ProfileView,ForgotPasswordView,ResetPasswordView


urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),

    path("login/", LoginView.as_view(), name="login"),

    path("me/", MeView.as_view(), name="me"),

    path("change-password/",ChangePasswordView.as_view(),name="change-password",),

    path("logout/",LogoutView.as_view(),name="logout",),

    path("profile/",ProfileView.as_view(),name="profile"),

    path("forgot-password/",ForgotPasswordView.as_view(),name="forgot-password",),

    path("reset-password/<int:uid>/<str:token>/",ResetPasswordView.as_view(),name="reset-password-api",),

    

    # path("profile/",UserInfoAPIView.as_view(),name="user-profile"),


]