from rest_framework import generics
from .models import GroceryItem
from orders.serializers import GroceryItemSerializer

class GroceryItemListCreateView(generics.ListCreateAPIView):
    queryset = GroceryItem.objects.all()
    serializer_class = GroceryItemSerializer

class GroceryItemDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = GroceryItem.objects.all()
    serializer_class = GroceryItemSerializer
    lookup_field = 'id'
