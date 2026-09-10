from django.urls import path
from .views import DownloadExcelReportView, CustomerReportView

urlpatterns = [
    path('excel/', DownloadExcelReportView.as_view(), name='download-excel-report'),
    path('customer/<int:customer_id>/', CustomerReportView.as_view(), name='customer-excel-report'),
]
