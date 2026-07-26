from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from accounts.models import User


class RegisterTestCase(APITestCase):

    def test_user_can_register(self):
        url = reverse("register")

        data = {
            "email": "mahdi@example.com",
            "password": "StrongPassword123!",
            "first_name": "Mahdi",
            "last_name": "Molaee",
        }

        response = self.client.post(url, data)

        self.assertEqual(
            response.status_code,
            status.HTTP_201_CREATED,
        )

        self.assertEqual(
            User.objects.count(),
            1,
        )

        self.assertEqual(
            User.objects.first().email,
            "mahdi@example.com",
        )

    def test_user_cannot_register_with_duplicate_email(self):
        User.objects.create_user(
            email="mahdi@example.com",
            password="StrongPassword123!",
        )

        url = reverse("register")

        data = {
            "email": "mahdi@example.com",
            "password": "AnotherPassword123!",
            "first_name": "Mahdi",
            "last_name": "Molaee",
        }

        response = self.client.post(url, data)

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )

        self.assertEqual(
            User.objects.count(),
            1,
        )