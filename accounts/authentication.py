from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import InvalidToken


class CookieJWTAuthentication(JWTAuthentication):

    def authenticate(self, request):

        header = self.get_header(request)

        # اگر Authorization Header وجود دارد
        # رفتار استاندارد SimpleJWT را حفظ کن
        if header is not None:
            return super().authenticate(request)

        # اگر Header وجود ندارد، Token را از Cookie بگیر
        raw_token = request.COOKIES.get("access_token")

        # Cookie وجود ندارد
        if raw_token is None:
            return None

        try:

            validated_token = self.get_validated_token(
                raw_token
            )

            return (
                self.get_user(validated_token),
                validated_token,
            )

        except InvalidToken:

            # Token منقضی یا نامعتبر است.
            # نباید endpointهای AllowAny را خراب کند.
            return None