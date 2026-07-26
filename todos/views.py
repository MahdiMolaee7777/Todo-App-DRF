from rest_framework import viewsets
from .models import Todo, Category
from .serializers import TodoReadSerializer,TodoWriteSerializer, CategorySerializer
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from .permissions import IsOwner, IsCategoryOwner
from rest_framework.decorators import action
from rest_framework.response import Response
from .filters import TodoFilter


class TodoViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated, IsOwner]

    def get_queryset(self):
        return (
            Todo.objects.filter(owner=self.request.user).select_related("category")
        )

    def get_serializer_class(self):
        if self.action in ["list", "retrieve"]:
            return TodoReadSerializer

        return TodoWriteSerializer

    @action(detail=True, methods=["post"])
    def toggle(self, request, pk=None):
        todo = self.get_object()

        todo.completed = not todo.completed
        todo.save()

        serializer = TodoReadSerializer(todo)

        return Response(serializer.data)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    filter_backends = [
        DjangoFilterBackend,
        SearchFilter,
        OrderingFilter,
    ]

    filterset_class = TodoFilter

    search_fields = [
        "title",
        "description",
    ]

    ordering_fields = [
        "created_at",
        "due_date",
        "priority",
    ]

    ordering = [
        "-created_at",
    ]



class CategoryViewSet(viewsets.ModelViewSet):
    serializer_class = CategorySerializer
    permission_classes = [
        IsAuthenticated,
        IsCategoryOwner,
    ]

    def get_queryset(self):
        return Category.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)