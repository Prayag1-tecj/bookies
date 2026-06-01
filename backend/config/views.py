from django.http import JsonResponse

def health_check(request):
    return JsonResponse({
        "status": "success",
        "message": "Bookies API is running"
    })