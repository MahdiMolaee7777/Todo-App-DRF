from django.shortcuts import render


def login_page(request):
    return render(request, "accounts/login.html")


def register_page(request):
    return render(request, "accounts/register.html")


def todo_list_page(request):
    return render(request, "todos/todo_list.html")

def TodoCreatePageView(request):
    return render(request, "todos/todo_form.html")

def TodoUpdatePageView(request, pk):

    return render(request,"todos/todo_edit_form.html",{"todo_id": pk,})

from django.shortcuts import render


def profile_page(request):

    return render(request,"accounts/profile.html")

from django.shortcuts import render


def change_password_page(request):

    return render(request,"accounts/change_password.html")