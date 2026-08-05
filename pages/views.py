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


def profile_page(request):

    return render(request,"accounts/profile.html")


def change_password_page(request):

    return render(request,"accounts/change_password.html")

def forgot_password_page(request):

    return render(request,"accounts/forgot_password.html",)


def reset_password_page(request, uid, token):

    return render(request,"accounts/reset_password.html",{"uid": uid,"token": token,})