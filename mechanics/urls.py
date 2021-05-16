from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('<int:id>', views.monster, name='monster'),
    path('about', views.about, name='about')
]
