from django.conf import settings
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.urls import reverse
import resend


token_generator = PasswordResetTokenGenerator()


resend.api_key = settings.RESEND_API_KEY


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

    resend.Emails.send(
        {
            "from": settings.DEFAULT_FROM_EMAIL,
            "to": [user.email],
            "subject": "Verify Email",
            "html": f"""
                <h2>Hello {user.first_name or user.email}</h2>

                <p>Please verify your email by clicking the link below:</p>

                <p>
                    <a href="{link}">
                        Verify Email
                    </a>
                </p>
            """,
        }
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

    resend.Emails.send(
        {
            "from": settings.DEFAULT_FROM_EMAIL,
            "to": [user.email],
            "subject": "Reset Password",
            "html": f"""
                <h2>Hello {user.first_name or user.email}</h2>

                <p>
                    Click the link below to reset your password:
                </p>

                <p>
                    <a href="{link}">
                        Reset Password
                    </a>
                </p>
            """,
        }
    )