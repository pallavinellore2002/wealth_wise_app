from django.shortcuts import render
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.mail import send_mail
import json

@csrf_exempt
def signup_view(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            username = data.get("username")
            email = data.get("email")
            password = data.get("password")

            if not username or not email or not password:
                return JsonResponse({"error": "Username, email, and password are required"}, status=400)

            if User.objects.filter(email=email).exists():
                return JsonResponse({"error": "Email already exists"}, status=400)

            user = User.objects.create_user(username=username, email=email, password=password)
            user.save()

            return JsonResponse({"message": "Signup successful!, Welcome to the Wealth Wise web App"}, status=201)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Only POST allowed"}, status=405)


@csrf_exempt
def signin_view(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            email = data.get("email")
            password = data.get("password")

            if not email or not password:
                return JsonResponse({"error": "Email and password required"}, status=400)

            try:
                user = User.objects.get(email=email)
            except User.DoesNotExist:
                return JsonResponse({"error": "User does not exist"}, status=404)

            user = authenticate(username=user.username, password=password)

            if user is not None:
                return JsonResponse({"message": "Login successful!"}, status=200)
            else:
                return JsonResponse({"error": "Invalid credentials"}, status=401)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Only POST allowed"}, status=405)


@csrf_exempt
def forgot_password_view(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            email = data.get("email")

            try:
                user = User.objects.get(email=email)
            except User.DoesNotExist:
                return JsonResponse({"error": "User with this email does not exist"}, status=404)

            # You can use Django's password reset in production.
            # For now, we just simulate sending a reset email.
            send_mail(
                subject="Reset your WealthWise password",
                message=f"Hello {user.username}, here is your password reset link: http://example.com/reset?email={email}",
                from_email="no-reply@wealthwise.com",
                recipient_list=[email],
                fail_silently=False,
            )

            return JsonResponse({"message": "Reset password link sent to your email"}, status=200)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Only POST allowed"}, status=405)


@csrf_exempt
def google_login_view(request):
    # This is a placeholder – full Google OAuth requires client-side + django-allauth or similar
    if request.method == "POST":
        return JsonResponse({"message": "Google login simulated – implement OAuth here"}, status=200)

    return JsonResponse({"error": "Only POST allowed"}, status=405)


def auth_home(request):
    return JsonResponse({'message': 'Welcome to the Auth API'})
@csrf_exempt
def budget_signup_view(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            username = data.get("username")
            email = data.get("email")
            password = data.get("password")

            if User.objects.filter(username=username).exists():
                return JsonResponse({"error": "Username already exists"}, status=400)

            if User.objects.filter(email=email).exists():
                return JsonResponse({"error": "Email already exists"}, status=400)

            user = User.objects.create_user(username=username, email=email, password=password)
            return JsonResponse({"message": "Budget Signup successful!"}, status=201)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Only POST allowed"}, status=405)
@csrf_exempt
def budget_signin_view(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            username = data.get("username")
            # email = data.get("email")
            password = data.get("password")

            user = authenticate(request, username=username, password=password)
            if user is not None:
                return JsonResponse({"message": "Login successful!"})
            else:
                return JsonResponse({"error": "Invalid credentials"}, status=401)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Only POST method is allowed"}, status=405)