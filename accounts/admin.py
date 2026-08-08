from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import User


@admin.register(User)
class CustomUserAdmin(UserAdmin):

    model = User

    list_display = (
        "email",
        "first_name",
        "last_name",
        "is_active",
        "is_staff",
        "date_joined",
    )

    ordering = (
        "email",
    )

    search_fields = (
        "email",
        "first_name",
        "last_name",
    )

    fieldsets = (
        (None, {
            "fields": (
                "email",
                "password",
            )
        }),

        ("Personal info", {
            "fields": (
                "first_name",
                "last_name",
                "avatar",
                "bio",
            )
        }),

        ("Permissions", {
            "fields": (
                "is_active",
                "is_staff",
                "is_superuser",
                "groups",
                "user_permissions",
            )
        }),

        ("Important dates", {
            "fields": (
                "last_login",
                "date_joined",
                "updated_at",
            )
        }),
    )

    add_fieldsets = (
        (None, {
            "classes": ("wide",),
            "fields": (
                "email",
                "password1",
                "password2",
                "is_active",
                "is_staff",
            ),
        }),
    )

    readonly_fields = (
    "date_joined",
    "updated_at",
    "last_login",
)
