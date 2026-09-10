from django.urls import path
from .views import GroceryItemListCreateView, GroceryItemDetailView

urlpatterns = [
    path('', GroceryItemListCreateView.as_view(), name='grocery-item-list-create'),
    path('<int:id>/', GroceryItemDetailView.as_view(), name='grocery-item-detail'),
]
