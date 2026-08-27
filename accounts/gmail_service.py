import base64
import os
from email.mime.text import MIMEText

from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build


SCOPES = [
    "https://www.googleapis.com/auth/gmail.send",
]


def get_gmail_credentials():

    credentials = Credentials(
        token=None,
        refresh_token=os.environ["GOOGLE_REFRESH_TOKEN"],
        token_uri="https://oauth2.googleapis.com/token",
        client_id=os.environ["GOOGLE_CLIENT_ID"],
        client_secret=os.environ["GOOGLE_CLIENT_SECRET"],
        scopes=SCOPES,
    )

    credentials.refresh(Request())

    return credentials


def send_gmail_email(to_email, subject, body):

    credentials = get_gmail_credentials()

    service = build(
        "gmail",
        "v1",
        credentials=credentials,
    )

    message = MIMEText(body)

    message["to"] = to_email
    message["subject"] = subject

    encoded_message = base64.urlsafe_b64encode(
        message.as_bytes()
    ).decode()

    response = service.users().messages().send(
        userId="me",
        body={
            "raw": encoded_message
        },
    ).execute()

    return response