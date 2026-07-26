from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from accounts.models import User


class MeTestCase(APITestCase):

    def test_authenticated_user_can_get_profile(self):
        user = User.objects.create_user(
            email="mahdi@example.com",
            password="StrongPassword123!",
            first_name="Mahdi",
            last_name="Molaee",
        )

        self.client.force_authenticate(user=user)

        url = reverse("me")

        response = self.client.get(url)

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )

        self.assertEqual(
            response.data["first_name"],
            user.first_name,
        )