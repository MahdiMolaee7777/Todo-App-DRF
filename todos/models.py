from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone

User = get_user_model()


class Category(models.Model):
    name = models.CharField("نام", max_length=100)
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="categories",
        verbose_name="کاربر",
    )
    color = models.CharField("رنگ", max_length=7, default="#007bff")
    created_at = models.DateTimeField("تاریخ ایجاد", auto_now_add=True)

    class Meta:
        verbose_name = "دسته‌بندی"
        verbose_name_plural = "دسته‌بندی‌ها"
        ordering = ["name"]
        constraints = [
            models.UniqueConstraint(
                fields=["name", "user"],
                name="unique_category_per_user",
            )
        ]

    def __str__(self):
        return self.name


class Todo(models.Model):

    class Priority(models.TextChoices):
        LOW = "low", "کم"
        MEDIUM = "medium", "متوسط"
        HIGH = "high", "زیاد"

    owner = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="todos",
        verbose_name="صاحب",
    )

    title = models.CharField("عنوان", max_length=200)

    description = models.TextField(
        "توضیحات",
        blank=True,
    )

    completed = models.BooleanField(
        "تکمیل شده",
        default=False,
        db_index=True,
    )

    priority = models.CharField(
        "اولویت",
        max_length=10,
        choices=Priority.choices,
        default=Priority.MEDIUM,
    )

    category = models.ForeignKey(
        Category,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="todos",
        verbose_name="دسته‌بندی",
    )

    due_date = models.DateField(
        "مهلت انجام",
        null=True,
        blank=True,
        db_index=True,
    )

    created_at = models.DateTimeField(
        "تاریخ ایجاد",
        auto_now_add=True,
    )

    updated_at = models.DateTimeField(
        "آخرین بروزرسانی",
        auto_now=True,
    )

    class Meta:
        verbose_name = "کار"
        verbose_name_plural = "کارها"
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["owner", "completed"]),
        ]

    def __str__(self):
        return self.title

    @property
    def is_overdue(self):
        if self.due_date and not self.completed:
            return timezone.localdate() > self.due_date
        return False