from rest_framework import generics
from django.views import View
import logging
from django.http import JsonResponse
from rest_framework.permissions import IsAuthenticated
from .models import Book, Category, Contact, Cart, Quote, UserProfile
from .serializers import BookSerializer, CategorySerializer, ContactSerializer, CartSerializer,QuoteSerializer,UserProfileSerializer
from rest_framework.pagination import PageNumberPagination
from rest_framework.decorators import api_view, permission_classes
from django.contrib.auth.decorators import login_required
from django.db.models import Q,Count
from django.db.models.functions import Lower
from rest_framework.pagination import PageNumberPagination
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

logger = logging.getLogger(__name__)

class GetUsernameView(APIView):
    def get(self, request):
        if request.user.is_authenticated:
            return Response({'username': request.user.username})
        else:
            return Response({'error': 'User is not authenticated.'}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['GET'])
def get_user_id(request):
    user_profile = request.user.username 
    return Response({'user_profile': user_profile})


class RegisterView(APIView):
    def post(self, request):
        username = request.data.get('username')
        email = request.data.get('email')
        password = request.data.get('password')

        if not username or not email or not password:
            return Response({'error': 'Please provide username, email, and password.'}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(username=username).exists() or UserProfile.objects.filter(email=email).exists():
            return Response({'error': 'Username or email already in use.'}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.create_user(username=username, email=email, password=password)
        UserProfile.objects.create(user=user, name=username, email=email)

        return Response({'message': 'Registration successful.'}, status=status.HTTP_201_CREATED)

class LoginView(APIView):
    def post(self, request):
        if request.user.is_authenticated:
            user_profile = UserProfile.objects.get(user=request.user)
            serializer = UserProfileSerializer(user_profile)
            return Response(serializer.data, status=status.HTTP_200_OK)

        username = request.data.get('username')
        password = request.data.get('password')

        if not username or not password:
            return Response({'error': 'Please provide both username and password.'}, status=status.HTTP_400_BAD_REQUEST)

        user = authenticate(request, username=username, password=password)

        if user is not None:
            login(request, user)
            user_profile = UserProfile.objects.get(user=user)
            serializer = UserProfileSerializer(user_profile)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Invalid username or password.'}, status=status.HTTP_401_UNAUTHORIZED)

class CustomPageNumberPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'pageSize'
    max_page_size = 50

class BookList(generics.ListAPIView):
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    pagination_class = CustomPageNumberPagination

    def get_queryset(self):
        queryset = Book.objects.all()
        category = self.request.query_params.get('category', None)
        search_term = self.request.query_params.get('searchTerm', None)

        if category:
            queryset = queryset.filter(categories__name=category)

        if search_term:
            queryset = queryset.filter(
                Q(title__icontains=search_term) | Q(author__icontains=search_term)
            )

        return queryset

class CategoryList(generics.ListAPIView):
    serializer_class = CategorySerializer

    def get_queryset(self):
        duplicate_names = Category.objects.values('name').annotate(name_count=Count('name')).filter(name_count__gt=1)

        for duplicate in duplicate_names:
            duplicate_name = duplicate['name']
            duplicate_count = duplicate['name_count']

            if duplicate_count > 1:
                latest_entry = Category.objects.filter(name=duplicate_name).order_by('-id').first()

                Category.objects.filter(name=duplicate_name).exclude(id=latest_entry.id).delete()

        return Category.objects.all()

class ContactCreate(generics.ListCreateAPIView):
    queryset = Contact.objects.none()  
    serializer_class = ContactSerializer
    permission_classes = [IsAuthenticated]
    def get(self, request, *args, **kwargs):
        return Response({'detail': 'You do not have permission to access this resource.'}, status=status.HTTP_403_FORBIDDEN)

logger = logging.getLogger(__name__)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_cart(request):
    try:
        user_profile = request.user.userprofile
        cart, created = Cart.objects.get_or_create(user_profile=user_profile)

        book_ids = request.data.get('books', [])
        cart.books.set(book_ids)
        cart.save()

        serializer = CartSerializer(cart)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    except Exception as e:
        return Response({'error': f'An error occurred during cart creation: {e}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class CartList(generics.ListAPIView):   
    serializer_class = CartSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user_profile = self.request.user.userprofile 
        return Cart.objects.filter(user_profile=user_profile)

class QuoteList(generics.ListCreateAPIView):
    queryset = Quote.objects.all()
    serializer_class = QuoteSerializer

class RandomQuote(View):
    def get(self, request, *args, **kwargs):
        random_quote = Quote.objects.order_by('?').first()
        return JsonResponse({'quote': random_quote.text})