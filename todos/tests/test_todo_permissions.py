from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from accounts.models import User
from todos.models import Todo


class TodoPermissionTestCase(APITestCase):

    def test_user_can_only_see_their_own_todos(self):
        user1 = User.objects.create_user(
            email="user1@test.com",
            password="Password123!",
        )

        user2 = User.objects.create_user(
            email="user2@test.com",
            password="Password123!",
        )

        Todo.objects.create(
            owner=user1,
            title="Todo 1",
        )

        Todo.objects.create(
            owner=user2,
            title="Todo 2",
        )

        self.client.force_authenticate(user=user1)

        url = reverse("todo-list")

        response = self.client.get(url)

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )

        self.assertEqual(
            response.data["count"],
            1,
        )

        self.assertEqual(
            response.data["results"][0]["title"],
            "Todo 1",
        )

    def test_user_cannot_delete_another_users_todo(self):
        user1 = User.objects.create_user(
            email="user1@test.com",
            password="Password123!",
        )

        user2 = User.objects.create_user(
            email="user2@test.com",
            password="Password123!",
        )

        todo = Todo.objects.create(
            owner=user2,
            title="User2 Todo",
        )

        self.client.force_authenticate(user=user1)

        url = reverse("todo-detail", args=[todo.id])

        response = self.client.delete(url)

        self.assertEqual(
            response.status_code,
            status.HTTP_404_NOT_FOUND,
        )

        self.assertEqual(
            Todo.objects.count(),
            1,
        )

    def test_user_can_update_their_own_todo(self):
        user = User.objects.create_user(
            email="mahdi@test.com",
            password="Password123!",
        )

        todo = Todo.objects.create(
            owner=user,
            title="Old Title",
        )

        self.client.force_authenticate(user=user)

        url = reverse("todo-detail", args=[todo.id])

        data = {
            "title": "New Title",
            "description": "",
            "completed": False,
            "priority": "medium",
            "category": None,
            "due_date": None,
        }

        response = self.client.patch(url,data,format="json",)

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )

        todo.refresh_from_db()

        self.assertEqual(
            todo.title,
            "New Title",
        )

    def test_user_can_delete_their_own_todo(self):
        user = User.objects.create_user(
            email="mahdi@test.com",
            password="Password123!",
        )

        todo = Todo.objects.create(
            owner=user,
            title="Delete Me",
        )

        self.client.force_authenticate(user=user)

        url = reverse("todo-detail", args=[todo.id])

        response = self.client.delete(url)

        self.assertEqual(
            response.status_code,
            status.HTTP_204_NO_CONTENT,
        )

        self.assertEqual(
            Todo.objects.count(),
            0,
        )