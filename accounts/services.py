from django.conf import settings
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.core.mail import send_mail
from django.urls import reverse


token_generator = PasswordResetTokenGenerator()


def send_verification_email(request, user):

    token = token_generator.make_token(user)

    uid = user.pk

    path = reverse(
        "accounts:verify-email",
        kwargs={
            "uid": uid,
            "token": token,
        }
    )

    link = request.build_absolute_uri(path)


    send_mail(
        subject="Verify Email",

        message=f"""
Hello {user.first_name or user.email}

Please verify your email by clicking the link below:

{link}
""",

        from_email=settings.DEFAULT_FROM_EMAIL,

        recipient_list=[
            user.email
        ],

        fail_silently=False,
    )



def send_password_reset_email(request, user):

    token = token_generator.make_token(
        user
    )

    uid = user.pk

    path = reverse(
        "accounts:reset-password",
        kwargs={
            "uid": uid,
            "token": token,
        }
    )

    link = request.build_absolute_uri(
        path
    )

    send_mail(
        subject="Reset Password",

        message=f"""
Hello {user.first_name or user.email}

Click the link below to reset your password:

{link}
""",

        from_email=settings.DEFAULT_FROM_EMAIL,

        recipient_list=[
            user.email
        ],

        fail_silently=False,
    )