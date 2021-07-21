from django.shortcuts import render, redirect

# Create your views here.


def index(request):
    return render(request, 'mechanics/index.html')


def monster(request, monsterId):
    return render(request, 'mechanics/monsterList.html', {
        'monsterId': monsterId
    })


def about(request):
    return render(request, 'mechanics/about.html')
