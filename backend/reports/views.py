from django.http import HttpResponse, Http404
from rest_framework.views import APIView
from rest_framework.response import Response
from .services import generate_master_excel
import os

class DownloadExcelReportView(APIView):
    def get(self, request):
        filter_type = request.query_params.get('filter')
        customer_id = request.query_params.get('customerId')
        from_date = request.query_params.get('from')
        to_date = request.query_params.get('to')

        file_path = generate_master_excel(
            filter_type=filter_type,
            customer_id=customer_id,
            from_date=from_date,
            to_date=to_date
        )

        if os.path.exists(file_path):
            with open(file_path, 'rb') as fh:
                response = HttpResponse(
                    fh.read(),
                    content_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                )
                response['Content-Disposition'] = 'attachment; filename="kanakis_store_orders.xlsx"'
                return response
        raise Http404("Excel report could not be generated.")

class CustomerReportView(APIView):
    def get(self, request, customer_id):
        file_path = generate_master_excel(customer_id=customer_id)
        if os.path.exists(file_path):
            with open(file_path, 'rb') as fh:
                response = HttpResponse(
                    fh.read(),
                    content_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                )
                response['Content-Disposition'] = f'attachment; filename="kanaki_customer_{customer_id}_orders.xlsx"'
                return response
        raise Http404("Customer report not found.")
