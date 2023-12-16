import json
from django.contrib import admin
from import_export import resources, fields
from import_export.admin import ImportExportModelAdmin
from import_export.widgets import ForeignKeyWidget,ManyToManyWidget

from .models import UserProfile, Category, Book, Contact, Cart,Quote


class UserProfileResource(resources.ModelResource):
    class Meta:
        model = UserProfile

class CategoryResource(resources.ModelResource):
    class Meta:
        model = Category

class BookResource(resources.ModelResource):
    id = fields.Field(attribute='id', column_name='id', readonly=True)
    categories = fields.Field(
        column_name='categories',
        attribute='categories',
        widget=ManyToManyWidget(Category, field='name', separator=',')
    )

    class Meta:
        model = Book
        fields = ('id', 'title', 'author', 'year', 'description', 'image_link', 'categories', 'rating')

    def before_import_row(self, row, **kwargs):
        if 'categories' in row and row['categories']:
            try:
                categories_list = json.loads(row['categories'])
                category_names = [category['categories'] for category in categories_list]
                row['categories'] = ','.join(category_names)
            except json.JSONDecodeError:
                pass  

class ContactResource(resources.ModelResource):
    class Meta:
        model = Contact

class CartResource(resources.ModelResource):    
    class Meta:
        model = Cart

class QuoteResource(resources.ModelResource):
    class Meta:
        model = Quote
        fields = ('id', 'text')

@admin.register(Quote)
class QuoteAdmin(ImportExportModelAdmin):
    resource_class = QuoteResource

@admin.register(UserProfile)
class UserProfileAdmin(ImportExportModelAdmin):
    resource_class = UserProfileResource

@admin.register(Category)
class CategoryAdmin(ImportExportModelAdmin):
    search_fields = ['name']
    resource_class = CategoryResource

@admin.register(Book)
class BookAdmin(ImportExportModelAdmin):
    search_fields = ['title', 'author']
    resource_class = BookResource

@admin.register(Contact)
class ContactAdmin(ImportExportModelAdmin):
    resource_class = ContactResource

@admin.register(Cart)
class CartAdmin(ImportExportModelAdmin):
    resource_class = CartResource
