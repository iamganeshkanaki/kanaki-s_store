from rest_framework import serializers
from .models import Order
from customers.models import Customer
from customers.serializers import CustomerSerializer
from groceries.models import GroceryItem

class GroceryItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = GroceryItem
        fields = ['id', 'name', 'quantity', 'unit', 'notes']

class OrderSerializer(serializers.ModelSerializer):
    customer = CustomerSerializer(read_only=True)
    customer_id = serializers.PrimaryKeyRelatedField(
        queryset=Customer.objects.all(), source='customer', write_only=True, required=False
    )
    items = GroceryItemSerializer(many=True, read_only=True)
    total_items = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = [
            'id',
            'order_number',
            'customer',
            'customer_id',
            'order_date',
            'source',
            'status',
            'items',
            'total_items',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['order_number', 'created_at', 'updated_at']

    def get_total_items(self, obj):
        return obj.items.count()
