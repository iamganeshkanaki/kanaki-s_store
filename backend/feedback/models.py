from django.db import models

class Feedback(models.Model):
    customer_name = models.CharField(max_length=200)
    mobile = models.CharField(max_length=15)
    order_number = models.CharField(max_length=50, blank=True, null=True)
    rating = models.PositiveSmallIntegerField(default=5)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.customer_name} ({self.rating} stars) - {self.created_at.strftime('%Y-%m-%d')}"
