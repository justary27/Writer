from .views import login, signup
from django.urls import path, include

urlpatterns = [
    path('docs/', include('apps.documents.urls')),
]
