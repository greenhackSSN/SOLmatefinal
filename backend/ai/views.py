from django.http import JsonResponse
from .ml_suggest_plan import process_plan

def get_plan(request):
    """
    Expects a GET parameter 'condition' from frontend
    """
    condition = request.GET.get('condition', '')
    plan = process_plan(condition)
    return JsonResponse(plan)
