# consumers.py

import json
from uuid import UUID
from channels.generic.websocket import AsyncWebsocketConsumer
from .models import Document, DocumentVersion
from .serializers import DocumentSerializer
from asgiref.sync import sync_to_async
from channels.db import database_sync_to_async

class DocConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.doc_id = self.scope['url_route']['kwargs']['room']
        self.room_group_name = f"doc_{self.doc_id}"

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )
    
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        action = text_data_json.get('action')

        print(f"Received message: {text_data}")

        if action == 'join':
            print('Joining')
        elif action == 'update':
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'handle_update_content',
                    'message': text_data_json
                },
            )
        else:
            print("discarding message")

    async def handle_update_content(self, event):
        text_data_json = event['message']
        doc_id = text_data_json.get('doc_id')
        user_id = text_data_json.get('user_id')
        content = text_data_json.get('content')
        delta = text_data_json.get('delta')

        if self.validate_user_access(doc_id):
            content = await self.update_content(doc_id, user_id, content)
            version = await self.create_version(doc_id, user_id, delta)

            await self.send(
                json.dumps({
                    'action': 'update',
                    'content': content,
                    'version': version,
                }, cls=UUIDEncoder),
            )

    @database_sync_to_async
    def update_content(self, doc_id, user_id, content):
        doc = Document.objects.get_doc_by_id(doc_id)
        doc.content = content
        doc.save()
        serializer = DocumentSerializer(doc)

        data = serializer.data
        data['owner'] = str(doc.owner)

        return data
    
    @database_sync_to_async
    def create_version(self, doc_id, user_id, delta):
        doc = Document.objects.get_doc_by_id(doc_id)
        doc_version = DocumentVersion.objects.create(document=doc, content=delta, user_id=user_id)
        doc_version.save()

        return str(doc_version.timestamp)

    def validate_user_access(self, doc_id):
        return True

class UUIDEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, UUID):
            return obj.hex
        return json.JSONEncoder.default(self, obj)
