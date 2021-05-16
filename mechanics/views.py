from django.shortcuts import render, redirect

# Create your views here.


def index(request):
    return render(request, 'mechanics/monster.html', {
        id: id
    })


def monster(request, id):
    return render(request, 'mechanics/monster.html', {
        id: id
    })

def about(request):
    return render(request, 'mechanics/about.html')
