from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.urls import reverse

from .gmail_service import send_gmail_email


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

    send_gmail_email(
        to_email=user.email,
        subject="Verify Email",
        body=f"""
Hello {user.first_name or user.email}

Please verify your email by clicking the link below:

{link}
""",
    )


def send_password_reset_email(request, user):

    token = token_generator.make_token(user)

    uid = user.pk

    path = reverse(
        "pages:reset-password",
        kwargs={
            "uid": uid,
            "token": token,
        }
    )

    link = request.build_absolute_uri(path)

    send_gmail_email(
        to_email=user.email,
        subject="Reset Password",
        body=f"""
Hello {user.first_name or user.email}

Click the link below to reset your password:

{link}
""",
    )
