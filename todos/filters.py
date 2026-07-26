import django_filters

from .models import Todo


class TodoFilter(django_filters.FilterSet):
    class Meta:
        model = Todo
        fields = [
            "completed",
            "priority",
            "category",
        ]