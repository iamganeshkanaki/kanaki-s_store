from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .services import OCRService

class OCRExtractView(APIView):
    def post(self, request):
        image_data = request.data.get('image')
        mime_type = request.data.get('mimeType', 'image/jpeg')

        if not image_data:
            return Response({'error': 'No image provided in request'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            ocr_service = OCRService(provider='gemini')
            items = ocr_service.extract_grocery_items(image_data, mime_type=mime_type)
            return Response({
                'success': True,
                'source': 'Kanaki AI OCR Vision Service',
                'items': items,
                'message': 'Grocery items extracted. Please review and edit before submitting.'
            })
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
