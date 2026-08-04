from rest_framework import generics,status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import User
from .serializers import RegisterSerializer,UserSerializer,LoginSerializer,UpdateProfileSerializer, ProfileSerializer , ChangePasswordSerializer,LogoutSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.views import APIView
from drf_spectacular.utils import extend_schema
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser



 

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer



class LoginView(TokenObtainPairView):

    serializer_class = LoginSerializer

    def post(self, request, *args, **kwargs):

        serializer = self.get_serializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        tokens = serializer.validated_data

        response = Response(
            {
                "detail": "Login successful.",
                "user": tokens["user"],
            },
            status=status.HTTP_200_OK,
        )

        response.set_cookie(
            key="access_token",
            value=tokens["access"],
            httponly=True,
            secure=False,      # بعداً در Production -> True
            samesite="Lax",
        )

        response.set_cookie(
            key="refresh_token",
            value=tokens["refresh"],
            httponly=True,
            secure=False,
            samesite="Lax",
        )

        return response



class MeView(generics.RetrieveUpdateAPIView):
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user

    def get_serializer_class(self):
        if self.request.method == "PATCH":
            return UpdateProfileSerializer

        return UserSerializer

@extend_schema(
    request=ChangePasswordSerializer,
    responses={200: None},
)



class ChangePasswordView(APIView):

    permission_classes = [
        IsAuthenticated
    ]


    def post(self, request):

        serializer = ChangePasswordSerializer(
            data=request.data,
            context={
                "request": request
            }
        )


        serializer.is_valid(
            raise_exception=True
        )


        request.user.set_password(
            serializer.validated_data["new_password"]
        )

        request.user.save()


        refresh_token = request.COOKIES.get(
            "refresh_token"
        )


        if refresh_token:

            token = RefreshToken(
                refresh_token
            )

            token.blacklist()



        response = Response(
            {
                "detail": "Password changed successfully. Please login again."
            },
            status=status.HTTP_200_OK
        )


        response.delete_cookie(
            "access_token"
        )

        response.delete_cookie(
            "refresh_token"
        )

       


        return response
    

@extend_schema(
    request=LogoutSerializer,
    responses={200: None},
)







class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):

        try:
            refresh_token = request.COOKIES.get("refresh_token")

            token = RefreshToken(refresh_token)
            token.blacklist()

            response = Response(
                {"detail": "Logout successful."},
                status=status.HTTP_205_RESET_CONTENT,
            )

            response.delete_cookie("access_token")
            response.delete_cookie("refresh_token")

            return response

        except Exception:
            return Response(
                {"detail": "Invalid token."},
                status=status.HTTP_400_BAD_REQUEST,
            )





class UserInfoAPIView(APIView):

    permission_classes = [
        IsAuthenticated
    ]


    def get(self, request):

        user = request.user


        return Response({


            "email": user.email,

            "first_name": user.first_name,

            "last_name": user.last_name,

        })





class ProfileView(generics.RetrieveUpdateAPIView):

    serializer_class = ProfileSerializer

    permission_classes = [IsAuthenticated]

    parser_classes = (
        MultiPartParser,
        FormParser,
    )

    def get_object(self):
        return self.request.user