from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.password_validation import validate_password

from .models import User


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        min_length=8
    )

    class Meta:
        model = User
        fields = [
            "email",
            "password",
            "first_name",
            "last_name",
        ]

    def create(self, validated_data):

        user = User.objects.create_user(
            email=validated_data["email"],
            password=validated_data["password"],
            first_name=validated_data.get("first_name", ""),
            last_name=validated_data.get("last_name", ""),
        )

        user.is_active = True
        user.save()

        return user



class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = (
            "id",
            "email",
            "first_name",
            "last_name",
            "avatar",
            "bio",
            "date_joined",
        )

        read_only_fields = fields



class LoginSerializer(TokenObtainPairSerializer):

    username_field = "email"

    @classmethod
    def get_token(cls, user):
        return super().get_token(user)


    def validate(self, attrs):

        data = super().validate(attrs)

        data["user"] = UserSerializer(
            self.user
        ).data

        return data



class UpdateProfileSerializer(serializers.ModelSerializer):

    class Meta:
        model = User

        fields = [
            "first_name",
            "last_name",
            "bio",
        ]



class ChangePasswordSerializer(serializers.Serializer):

    old_password = serializers.CharField(
        write_only=True,
        required=True,
    )

    new_password = serializers.CharField(
        write_only=True,
        min_length=8,
        required=True,
    )

    def validate_old_password(self, value):

        user = self.context["request"].user

        if not user.check_password(value):
            raise serializers.ValidationError(
                "Old password is incorrect."
            )

        return value

    def validate_new_password(self, value):

        validate_password(value)

        return value

    def validate(self, attrs):

        if attrs["old_password"] == attrs["new_password"]:

            raise serializers.ValidationError(
                "New password must be different from the current password."
            )

        return attrs



class LogoutSerializer(serializers.Serializer):

    refresh = serializers.CharField()


    def save(self):

        refresh_token = self.validated_data["refresh"]

        token = RefreshToken(refresh_token)

        token.blacklist()


class ProfileSerializer(serializers.ModelSerializer):

    avatar = serializers.ImageField(required=False)

    class Meta:
        model = User
        fields = [
            "email",
            "first_name",
            "last_name",
            "bio",
            "avatar",
        ]

        read_only_fields = [
            "email"
        ]