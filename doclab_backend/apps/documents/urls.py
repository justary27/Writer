from django.urls import path

from .views import document_list, document_detail

urlpatterns = [
    path('', document_list),
    path('<str:document_id>/', document_detail),
]
