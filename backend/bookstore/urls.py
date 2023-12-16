from django.urls import path
from .views import (
    RegisterView,
    LoginView,
    BookList,
    CategoryList,
    ContactCreate,
    create_cart,
    QuoteList,
    RandomQuote,
    get_user_id,
    GetUsernameView,
    CartList, 
)

urlpatterns = [
    path('api/books/', BookList.as_view(), name='book-list'),
    path('api/categories/', CategoryList.as_view(), name='category-list'),
    path('api/contacts/', ContactCreate.as_view(), name='contact-list'),
    path('api/create-cart/', create_cart, name='create-cart'),
    path('api/cart/', CartList.as_view(), name='cart-list'), 
    path('api/quotes/', QuoteList.as_view(), name='quote-list'),
    path('api/quotes/random/', RandomQuote.as_view(), name='random_quote'),
    path('api/register/', RegisterView.as_view(), name='register'),
    path('api/login/', LoginView.as_view(), name='login'),
    path('api/get-user-id/', get_user_id, name='get-user-id'),
    path('api/get-username/', GetUsernameView.as_view(), name='get-username'),

]
