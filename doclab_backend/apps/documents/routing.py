# routing.py

from django.urls import re_path
from .consumers import DocConsumer

websocket_urlpatterns = [
    re_path(r'ws/text_editor/(?P<room>\w+)', DocConsumer.as_asgi()),
]
