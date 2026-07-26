from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from accounts.models import User


class LoginTestCase(APITestCase):

    def test_user_can_login(self):
        User.objects.create_user(
            email="mahdi@example.com",
            password="StrongPassword123!",
        )

        url = reverse("login")

        data = {
            "email": "mahdi@example.com",
            "password": "StrongPassword123!",
        }

        response = self.client.post(url, data)

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )

        self.assertIn("access", response.data)
        self.assertIn("refresh", response.data)

    def test_user_cannot_login_with_wrong_password(self):
        User.objects.create_user(
            email="mahdi@example.com",
            password="StrongPassword123!",
        )

        url = reverse("login")

        data = {
            "email": "mahdi@example.com",
            "password": "WrongPassword123!",
        }

        response = self.client.post(url, data)

        self.assertEqual(
            response.status_code,
            status.HTTP_401_UNAUTHORIZED,
        )