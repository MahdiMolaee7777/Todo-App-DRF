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

    resend.api_key = settings.RESEND_API_KEY

    resend.Emails.send({
        "from": settings.DEFAULT_FROM_EMAIL,
        "to": [user.email],
        "subject": "Verify Email",
        "text": f"""
Hello {user.first_name or user.email}

Please verify your email by clicking the link below:

{link}
""",
    })

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

    resend.api_key = settings.RESEND_API_KEY

    resend.Emails.send({
        "from": settings.DEFAULT_FROM_EMAIL,
        "to": [user.email],
        "subject": "Reset Password",
        "text": f"""
Hello {user.first_name or user.email}

Click the link below to reset your password:

{link}
""",
    })