from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import csrf_exempt
from django.utils import timezone
from django.db.models import Sum, Avg
import json
from .models import ProjectSubmission, ContactMessage
from .forms import ContactMessageForm


def index(request):
    return render(request, "index.html")


def about(request):
    return render(request, "about.html")


def contact(request):
    return render(request, "contact.html")


def services(request):
    return render(request, "services.html")


def portfolio(request):
    return render(request, "portfolio.html")


def webdev(request):
    return render(request, "webdev.html")


def uiux(request):
    return render(request, "uiux.html")


def graphicdesign(request):
    return render(request, "graphicdesign.html")


def brandidentity(request):
    return render(request, "brandidentity.html")


def startproject(request):
    return render(request, "startproject.html")


def project_catalyst_view(request):
    return render(request, "project_catalyst.html")


@require_POST
def submit_project(request):
    try:
        data = json.loads(request.body)

        # Create project submission
        ProjectSubmission.objects.create(
            project_type=data.get("project_type"),
            client_name=data.get("client_name"),
            email=data.get("email"),
            company=data.get("company", ""),
            phone=data.get("phone", ""),
            project_title=data.get("project_title"),
            project_description=data.get("project_description"),
            budget=float(data.get("budget", 0).replace("$", "").replace(",", "")),
            timeline=data.get("timeline"),
            reference_links=data.get("reference_links", ""),
            heard_from=data.get("heard_from", ""),
            additional_notes=data.get("additional_notes", ""),
        )

        return JsonResponse(
            {"success": True, "message": "Project submitted successfully!"}
        )
    except Exception as e:
        return JsonResponse({"success": False, "error": str(e)}, status=400)


def contact_view(request):
    if request.method == "POST":
        form = ContactMessageForm(request.POST)
        if form.is_valid():
            form.save()
            return JsonResponse(
                {"success": True, "message": "Message sent successfully!"}
            )
        return JsonResponse({"success": False, "errors": form.errors})
    return render(request, "contact.html", {"form": ContactMessageForm()})


def admin_dashboard(request):
    if not request.user.is_staff:
        return redirect("admin:login")

    # Get statistics for dashboard
    project_stats = {
        "total": ProjectSubmission.objects.count(),
        "total_budget": ProjectSubmission.objects.aggregate(Sum("budget"))[
            "budget__sum"
        ]
        or 0,
        "avg_budget": ProjectSubmission.objects.aggregate(Avg("budget"))["budget__avg"]
        or 0,
        "pending": ProjectSubmission.objects.filter(status="pending").count(),
    }

    contact_stats = {
        "total": ContactMessage.objects.count(),
        "unread": ContactMessage.objects.filter(is_read=False).count(),
        "today": ContactMessage.objects.filter(
            submitted_at__date=timezone.now().date()
        ).count(),
    }

    recent_projects = ProjectSubmission.objects.all()[:5]
    recent_messages = ContactMessage.objects.all()[:5]

    context = {
        "project_stats": project_stats,
        "contact_stats": contact_stats,
        "recent_projects": recent_projects,
        "recent_messages": recent_messages,
    }

    return render(request, "admin_dashboard.html", context)


@csrf_exempt
def submit_contact(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body.decode('utf-8'))
            
            # Save to database
            contact = ContactMessage.objects.create(
                name=data.get('name', '').strip(),
                email=data.get('email', '').strip(),
                subject=data.get('subject', '').strip(),
                message=data.get('message', '').strip(),
            )
            
            return JsonResponse({
                "success": True,
                "message": "Message sent successfully!",
                "id": contact.id  # Make sure it's contact.id, not contact
            })
            
        except Exception as e:
            return JsonResponse({
                "success": False,
                "error": str(e)
            }, status=400)
    
    return JsonResponse({
        "success": False,
        "error": "Method not allowed"
    }, status=405)
