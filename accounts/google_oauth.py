import os

from google_auth_oauthlib.flow import Flow


SCOPES = [
    "https://www.googleapis.com/auth/gmail.send",
]


CLIENT_CONFIG = {
    "web": {
        "client_id": os.environ["GOOGLE_CLIENT_ID"],
        "client_secret": os.environ["GOOGLE_CLIENT_SECRET"],
        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
        "token_uri": "https://oauth2.googleapis.com/token",
        "redirect_uris": [
            os.environ["GOOGLE_REDIRECT_URI"]
        ],
    }
}


def create_google_flow():

    flow = Flow.from_client_config(
        CLIENT_CONFIG,
        scopes=SCOPES,
    )

    flow.redirect_uri = os.environ["GOOGLE_REDIRECT_URI"]

    return flow