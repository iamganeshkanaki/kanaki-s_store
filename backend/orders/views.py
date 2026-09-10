from rest_framework import generics, status, filters
from rest_framework.response import Response
from .models import Order
from .serializers import OrderSerializer
from customers.models import Customer
from groceries.models import GroceryItem
import datetime

class OrderListCreateView(generics.ListCreateAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['order_number', 'customer__name', 'customer__mobile', 'status']

    def get_queryset(self):
        qs = super().get_queryset()
        status_param = self.request.query_params.get('status')
        if status_param and status_param != 'All':
            qs = qs.filter(status=status_param)
        customer_id = self.request.query_params.get('customerId')
        if customer_id:
            qs = qs.filter(customer__id=customer_id)
        mobile = self.request.query_params.get('mobile')
        if mobile:
            qs = qs.filter(customer__mobile=mobile)
        return qs

    def create(self, request, *args, **kwargs):
        data = request.data
        customer_data = data.get('customer')
        items_data = data.get('items', [])
        source = data.get('source', 'Manual Entry')

        if not customer_data or not customer_data.get('name') or not customer_data.get('mobile') or not customer_data.get('address'):
            return Response({'error': 'Customer name, mobile number, and address are required'}, status=status.HTTP_400_BAD_REQUEST)

        if not items_data:
            return Response({'error': 'At least one grocery item is required'}, status=status.HTTP_400_BAD_REQUEST)

        customer, _ = Customer.objects.update_or_create(
            mobile=customer_data.get('mobile').strip(),
            defaults={
                'name': customer_data.get('name').strip(),
                'email': customer_data.get('email', '').strip() or None,
                'address': customer_data.get('address').strip(),
                'city': customer_data.get('city', 'Hubballi').strip(),
                'pincode': customer_data.get('pincode', '').strip() or None,
            }
        )

        today_str = datetime.date.today().strftime('%Y%m%d')
        order_count = Order.objects.count() + 1
        order_number = f"KKS-{today_str}-{order_count:03d}"

        order = Order.objects.create(
            order_number=order_number,
            customer=customer,
            source=source,
            status='Pending'
        )

        for item_data in items_data:
            GroceryItem.objects.create(
                order=order,
                name=item_data.get('name', 'Item').strip(),
                quantity=float(item_data.get('quantity', 1)),
                unit=item_data.get('unit', 'kg').strip(),
                notes=item_data.get('notes', '').strip()
            )

        # Trigger automatic Excel update
        try:
            from reports.services import generate_master_excel
            generate_master_excel()
        except Exception as exc:
            pass

        serializer = self.get_serializer(order)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class OrderDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    lookup_field = 'id'

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', True)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)
