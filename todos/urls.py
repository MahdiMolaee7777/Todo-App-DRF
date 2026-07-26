from rest_framework.routers import DefaultRouter
from .views import TodoViewSet, CategoryViewSet


router = DefaultRouter()

router.register("todos", TodoViewSet, basename="todo")
router.register("categories", CategoryViewSet, basename="category")


urlpatterns = router.urls