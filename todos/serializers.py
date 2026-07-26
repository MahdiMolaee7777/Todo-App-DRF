from rest_framework import serializers
from .models import Todo, Category



class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = [
            "id",
            "name",
            "color",
            "created_at",
        ]
        read_only_fields = [
            "id",
            "created_at",
        ]


class TodoReadSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    class Meta:
        model = Todo
        fields = [
            "id",
            "title",
            "description",
            "completed",
            "priority",
            "category",
            "due_date",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "created_at",
            "updated_at",
        ]

from rest_framework import serializers

class TodoWriteSerializer(serializers.ModelSerializer):

    class Meta:
        model = Todo
        fields = [
            "title",
            "description",
            "completed",
            "priority",
            "category",
            "due_date",
        ]

    def validate_title(self, value):
        value = value.strip()

        if len(value) < 3:
            raise serializers.ValidationError(
                "Title must contain at least 3 characters."
            )

        return value

    def validate_category(self, value):
        request = self.context.get("request")

        if value and value.user != request.user:
            raise serializers.ValidationError(
                "You cannot use another user's category."
            )
    

        return value

    def validate(self, attrs):
        completed = attrs.get("completed")
        due_date = attrs.get("due_date")

        if completed and due_date:
            from django.utils import timezone

            if due_date > timezone.now().date():
                raise serializers.ValidationError(
                    "Completed task cannot have a future due date."
                )

        return attrs