from django.urls import path

from .views import RegisterView,MeView,LoginView,ChangePasswordView,LogoutView,UserInfoAPIView,ProfileView,ForgotPasswordView,ResetPasswordView,VerifyEmailView,ResendVerificationEmailView,RefreshView,DebugUserView,DebugDeleteUserView,DebugDeleteOtherUsersView,GoogleOAuthCallbackView,GoogleOAuthStartView

app_name = "accounts"


urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),

    path("login/", LoginView.as_view(), name="login"),

    path("me/", MeView.as_view(), name="me"),

    path("change-password/",ChangePasswordView.as_view(),name="change-password",),

    path("logout/",LogoutView.as_view(),name="logout",),

    path("profile/",ProfileView.as_view(),name="profile"),

    path("forgot-password/",ForgotPasswordView.as_view(),name="forgot-password",),

    path("reset-password/<int:uid>/<str:token>/",ResetPasswordView.as_view(),name="reset-password-api",),

    path("verify-email/<int:uid>/<str:token>/",VerifyEmailView.as_view(),name="verify-email",),

    path("resend-verification/",ResendVerificationEmailView.as_view(),name="resend-verification",),

    path("refresh/",RefreshView.as_view(),name="refresh",),

    path("debug-user/",DebugUserView.as_view()),

    path("debug-delete-user/",DebugDeleteUserView.as_view(),),

    path("debug-delete-other-users/",DebugDeleteOtherUsersView.as_view(),),

    path("google/connect/",GoogleOAuthStartView.as_view(),name="google-connect",),


    path("google/callback/",GoogleOAuthCallbackView.as_view(),name="google-callback",),



]