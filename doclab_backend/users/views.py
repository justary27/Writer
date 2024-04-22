from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .serializers import UserSerializer
from .models import User
from rest_framework.authtoken.models import Token


# Create your views here.

@api_view(['POST'])
def login(request):
    data = request.data
    email = data.get('email')
    password = data.get('password')

    try:
        user = User.objects.get_user_by_email(email)
    except User.DoesNotExist:
        return Response(
            {'message': 'Invalid username or password'},
            status=status.HTTP_400_BAD_REQUEST
        )

    if user.check_password(password):
        token = Token.objects.get(user=user)

        return Response(
            {
                'message': 'Login successful', 
                'data': {
                    'id': user.id,
                    'token': str(token),
                    'is_active': user.is_active,
                    'email': user.email,
                }
            },
            status=status.HTTP_200_OK
        )
    else:
        return Response(
            {'message': 'Invalid username or password'},
            status=status.HTTP_400_BAD_REQUEST
        )

@api_view(['POST'])
def signup(request):
    serializer = UserSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()

        user = User.objects.get_user_by_email(serializer.data.get('email'))
        token = Token.objects.get(user=user)

        return Response({
            "message": "User created successfully",
            "data": {
                "id": user.id,
                "email": user.email,
                "is_active": user.is_active,
                "token": str(token),
            }
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
