from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.exceptions import PermissionDenied


from .serializers import DocumentSerializer
from .models import Document
from utils.handlers.permissions.permission_handler import IsOwner


# Create your views here.

@api_view(['GET', 'POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def document_list(request, user_id):
    match request.method:
        case 'POST':
            return create_document(request, user_id)
        case 'GET':
            return get_documents(request, user_id)
        case _:
            return Response(
                {'message': 'Method not allowed'},
                status=status.HTTP_405_METHOD_NOT_ALLOWED
            )

def create_document(request, user_id):
    data = request.data
    data['owner'] = user_id

    serializer = DocumentSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

def get_documents(request, user_id):
    try:
        docs = Document.objects.get_user_docs(user_id)
        perms = IsOwner().has_object_permission(request, None, docs[0])

        # if not perms:
        #     raise PermissionDenied
        
        serialized_docs = DocumentSerializer(docs, many=True)

        return Response(serialized_docs.data, status=status.HTTP_200_OK)
    except Document.DoesNotExist:
        return Response(
            {'message': 'No documents found'},
            status=status.HTTP_404_NOT_FOUND
        )

@api_view(['GET', 'PUT', 'DELETE'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def document_detail(request, user_id, document_id):
    match request.method:
        case 'GET':
            return get_document(request, user_id, document_id)
        case 'PUT':
            return update_document(request, user_id, document_id)
        case 'DELETE':
            return delete_document(request, user_id, document_id)
        case _:
            return Response(
                {'message': 'Method not allowed'},
                status=status.HTTP_405_METHOD_NOT_ALLOWED
            )

def get_document(request: Request, user_id, document_id):
    print(document_id)
    try:
        doc = Document.objects.get_doc_by_id(document_id)
        has_perms = IsOwner().has_object_permission(request, None, doc)

        # if not has_perms:
        #     raise PermissionDenied

        serialized_doc = DocumentSerializer(doc)
        return Response(serialized_doc.data, status=status.HTTP_200_OK)
    except Document.DoesNotExist:
        return Response(
            {'message': 'Document not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    except PermissionDenied:
        return Response(
            {'message': 'You do not have permission to view this resource'},
            status=status.HTTP_403_FORBIDDEN
        )

def update_document(request, user_id, document_id):
    try:
        doc = Document.objects.get_doc_by_id(document_id)
        serializer = DocumentSerializer(doc, data=request.data, partial=True)
        has_perms = IsOwner().has_object_permission(request, None, doc)

        # if not has_perms:
        #     raise PermissionDenied
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Document.DoesNotExist:
        return Response(
            {'message': 'Document not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    except PermissionDenied:
        return Response(
            {'message': 'You do not have permission to access this resource'},
            status=status.HTTP_403_FORBIDDEN
        )

def delete_document(request, user_id, document_id):
    try:
        doc = Document.objects.get_doc_by_id(document_id)
        has_perms = IsOwner().has_object_permission(request, None, doc)

        if not has_perms:
            raise PermissionDenied

        doc.delete()

        return Response(
            {'message': 'Document deleted'},
            status.HTTP_200_OK
        )
    except Document.DoesNotExist:
        return Response(
            {'message': 'Document not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    except PermissionDenied:
        return Response(
            {'message': 'You do not have permission to view this resource'},
            status=status.HTTP_403_FORBIDDEN
        )
