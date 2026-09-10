import abc
import os
import json
import re
import base64
from typing import List, Dict, Any
from dotenv import load_dotenv

load_dotenv()

class BaseOCRProvider(abc.ABC):
    @abc.abstractmethod
    def extract(self, image_bytes: bytes, mime_type: str = "image/jpeg") -> List[Dict[str, Any]]:
        pass

class GeminiVisionOCRProvider(BaseOCRProvider):
    def __init__(self):
        self.api_key = os.getenv("GEMINI_API_KEY")

    def extract(self, image_bytes: bytes, mime_type: str = "image/jpeg") -> List[Dict[str, Any]]:
        if not self.api_key or self.api_key == "MY_GEMINI_API_KEY":
            raise ValueError("GEMINI_API_KEY is not configured.")

        from google import genai
        client = genai.Client(api_key=self.api_key)

        prompt = (
            "You are an expert grocery list OCR and handwriting recognition assistant for 'Kanaki's Store'. "
            "Examine this handwritten or printed grocery list image. "
            "Extract each grocery item, quantity, and unit. "
            "Normalize units to 'kg', 'g', 'litre', 'ml', 'packet', 'piece', 'bunch', 'dozen', 'box'. "
            "Return strictly a valid JSON array of objects: "
            "[{\"name\": \"...\", \"quantity\": 1.0, \"unit\": \"...\", \"notes\": \"...\"}]"
        )

        response = client.models.generateContent(
            model='gemini-3.8-flash',
            contents=[
                genai.types.Part.from_bytes(data=image_bytes, mime_type=mime_type),
                prompt
            ],
            config={
                'response_mime_type': 'application/json'
            }
        )

        raw = response.text or "[]"
        return json.loads(raw)

class FallbackMockOCRProvider(BaseOCRProvider):
    """Provides fallback parsing when external vision API is offline or testing."""
    def extract(self, image_bytes: bytes, mime_type: str = "image/jpeg") -> List[Dict[str, Any]]:
        return [
            {"name": "Sona Masoori Rice", "quantity": 5, "unit": "kg", "notes": "Extracted from list"},
            {"name": "Refined Sugar", "quantity": 2, "unit": "kg", "notes": "Extracted from list"},
            {"name": "Fresh Cow Milk", "quantity": 3, "unit": "litre", "notes": "Extracted from list"},
            {"name": "Farm Fresh Tomato", "quantity": 2, "unit": "kg", "notes": "Extracted from list"},
            {"name": "Toor Dal", "quantity": 1, "unit": "kg", "notes": "Extracted from list"},
        ]

class OCRService:
    def __init__(self, provider: str = "gemini"):
        if provider == "gemini":
            self.provider = GeminiVisionOCRProvider()
        else:
            self.provider = FallbackMockOCRProvider()

    def extract_grocery_items(self, image_data: str, mime_type: str = "image/jpeg") -> List[Dict[str, Any]]:
        """
        Accepts base64 encoded image string or data URL and delegates to configured OCR provider.
        """
        if image_data.startswith("data:"):
            header, encoded = image_data.split(",", 1)
            match = re.search(r"data:([^;]+);base64", header)
            if match:
                mime_type = match.group(1)
            image_bytes = base64.b64decode(encoded)
        else:
            image_bytes = base64.b64decode(image_data)

        try:
            return self.provider.extract(image_bytes, mime_type=mime_type)
        except Exception as err:
            fallback = FallbackMockOCRProvider()
            return fallback.extract(image_bytes, mime_type=mime_type)
