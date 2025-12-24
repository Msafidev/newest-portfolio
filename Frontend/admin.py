# Frontend/admin.py
from django.contrib import admin
from django.utils.html import format_html
from .models import ProjectSubmission, ContactMessage
from django.db.models import Count, Sum, Avg
from django.utils import timezone


@admin.register(ProjectSubmission)
class ProjectSubmissionAdmin(admin.ModelAdmin):
    list_display = [
        "id",
        "project_title",
        "client_name",
        "project_type_display",
        "budget_display",
        "timeline_display",
        "status_badge",
        "submitted_at_display",
    ]
    list_display_links = ["id", "project_title"]
    list_filter = ["project_type", "timeline", "status", "submitted_at"]
    search_fields = ["project_title", "client_name", "email", "company", "phone"]
    readonly_fields = ["submitted_at", "created_at", "updated_at"]
    list_per_page = 25
    
    # Actions
    actions = ["mark_as_reviewed", "mark_as_contacted", "mark_as_accepted", "mark_as_rejected"]
    
    fieldsets = [
        (
            "Project Details",
            {
                "fields": [
                    "project_title",
                    "project_type",
                    "project_description",
                    "budget",
                    "timeline",
                ]
            },
        ),
        (
            "Client Information",
            {
                "fields": [
                    "client_name",
                    "email",
                    "company",
                    "phone",
                    "heard_from",
                ]
            },
        ),
        (
            "Additional Information",
            {
                "fields": [
                    "reference_links",
                    "additional_notes",
                    "attached_files",
                ]
            },
        ),
        (
            "Admin",
            {
                "fields": [
                    "status",
                    "notes",
                    "submitted_at",
                    "created_at",
                    "updated_at",
                ],
                "classes": ["collapse"],
            },
        ),
    ]
    
    # Custom display methods
    def project_type_display(self, obj):
        return obj.get_project_type_display()
    project_type_display.short_description = "Type"
    
    def budget_display(self, obj):
        if obj.budget:
            return f"${obj.budget:,.2f}"
        return "-"
    budget_display.short_description = "Budget"
    
    def timeline_display(self, obj):
        return obj.get_timeline_display()
    timeline_display.short_description = "Timeline"
    
    def submitted_at_display(self, obj):
        return obj.submitted_at.strftime("%b %d, %Y")
    submitted_at_display.short_description = "Submitted"
    submitted_at_display.admin_order_field = "submitted_at"
    
    def status_badge(self, obj):
        color_map = {
            "pending": "#9ca3af",
            "reviewed": "#3b82f6",
            "contacted": "#f59e0b",
            "accepted": "#10b981",
            "rejected": "#ef4444",
        }
        status_text = obj.get_status_display().upper() if obj.status else "UNKNOWN"
        color = color_map.get(obj.status, "#9ca3af")
        
        # FIXED: Proper format_html usage
        return format_html(
            '<span style="background-color: {}; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 500;">{}</span>',
            color,
            status_text,
        )
    status_badge.short_description = "Status"
    
    # Action methods
    def mark_as_reviewed(self, request, queryset):
        updated = queryset.update(status="reviewed")
        self.message_user(request, f"{updated} project(s) marked as reviewed.")
    mark_as_reviewed.short_description = "Mark selected as reviewed"
    
    def mark_as_contacted(self, request, queryset):
        updated = queryset.update(status="contacted")
        self.message_user(request, f"{updated} project(s) marked as contacted.")
    mark_as_contacted.short_description = "Mark selected as contacted"
    
    def mark_as_accepted(self, request, queryset):
        updated = queryset.update(status="accepted")
        self.message_user(request, f"{updated} project(s) marked as accepted.")
    mark_as_accepted.short_description = "Mark selected as accepted"
    
    def mark_as_rejected(self, request, queryset):
        updated = queryset.update(status="rejected")
        self.message_user(request, f"{updated} project(s) marked as rejected.")
    mark_as_rejected.short_description = "Mark selected as rejected"
    
    def changelist_view(self, request, extra_context=None):
        extra_context = extra_context or {}
        
        try:
            today = timezone.now().date()
            
            # Get counts safely
            total_projects = ProjectSubmission.objects.count()
            pending_count = ProjectSubmission.objects.filter(status="pending").count()
            today_count = ProjectSubmission.objects.filter(
                submitted_at__date=today
            ).count()
            
            # Get budget aggregates safely
            budget_agg = ProjectSubmission.objects.aggregate(
                total=Sum("budget"),
                avg=Avg("budget")
            )
            
            stats = {
                "total_projects": total_projects,
                "pending_count": pending_count,
                "today_count": today_count,
                "total_budget": budget_agg["total"] or 0,
                "avg_budget": budget_agg["avg"] or 0,
            }
            
           
            
        except Exception as e:
            # If there's an error, provide default stats
            stats = {
                "total_projects": 0,
                "pending_count": 0,
                "today_count": 0,
                "total_budget": 0,
                "avg_budget": 0,
            }
           
        
        return super().changelist_view(request, extra_context=extra_context)


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = [
        "id",
        "name",
        "email",
        "subject_truncated",
        "is_read",  # Required for list_editable
        "is_read_badge",
        "submitted_at_display",
    ]
    list_display_links = ["id", "name"]
    list_filter = ["is_read", "is_archived", "submitted_at"]
    search_fields = ["name", "email", "subject", "message"]
    readonly_fields = ["submitted_at", "created_at", "updated_at"]
    list_editable = ["is_read"]
    list_per_page = 25
    
    # Actions
    actions = ["mark_as_read", "mark_as_unread", "archive_messages"]
    
    fieldsets = [
        (
            "Message Details",
            {
                "fields": [
                    "name",
                    "email",
                    "subject",
                    "message",
                ]
            },
        ),
        (
            "Status & Timestamps",
            {
                "fields": [
                    "is_read",
                    "is_archived",
                    "submitted_at",
                    "created_at",
                    "updated_at",
                ]
            },
        ),
    ]
    
    # Custom display methods
    def subject_truncated(self, obj):
        if obj.subject and len(obj.subject) > 50:
            return f"{obj.subject[:47]}..."
        return obj.subject or ""
    subject_truncated.short_description = "Subject"
    
    def submitted_at_display(self, obj):
        if obj.submitted_at:
            return obj.submitted_at.strftime("%b %d, %Y %H:%M")
        return ""
    submitted_at_display.short_description = "Submitted"
    submitted_at_display.admin_order_field = "submitted_at"
    
    def is_read_badge(self, obj):
        # FIXED: Proper format_html usage with explicit parameters
        if obj.is_read:
            return format_html(
                '<span style="background-color: {}; color: {}; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 500;">{}</span>',
                "#10b981",  # background color
                "white",    # text color
                "READ",     # text
            )
        return format_html(
            '<span style="background-color: {}; color: {}; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 500;">{}</span>',
            "#ef4444",     # background color
            "white",       # text color
            "UNREAD",      # text
        )
    is_read_badge.short_description = "Status"
    
    # Action methods
    def mark_as_read(self, request, queryset):
        updated = queryset.update(is_read=True)
        self.message_user(request, f"{updated} message(s) marked as read.")
    mark_as_read.short_description = "Mark selected as read"
    
    def mark_as_unread(self, request, queryset):
        updated = queryset.update(is_read=False)
        self.message_user(request, f"{updated} message(s) marked as unread.")
    mark_as_unread.short_description = "Mark selected as unread"
    
    def archive_messages(self, request, queryset):
        updated = queryset.update(is_archived=True)
        self.message_user(request, f"{updated} message(s) archived.")
    archive_messages.short_description = "Archive selected messages"
    
    def changelist_view(self, request, extra_context=None):
        extra_context = extra_context or {}
        
        try:
            today = timezone.now().date()
            
            stats = {
                "total_messages": ContactMessage.objects.count(),
                "unread_count": ContactMessage.objects.filter(is_read=False).count(),
                "today_count": ContactMessage.objects.filter(submitted_at__date=today).count(),
                "archived_count": ContactMessage.objects.filter(is_archived=True).count(),
            }
            
            
            
        except Exception as e:
            # Provide default stats on error
            stats = {
                "total_messages": 0,
                "unread_count": 0,
                "today_count": 0,
                "archived_count": 0,
            }
            
        
        return super().changelist_view(request, extra_context=extra_context)


# Customize admin site
admin.site.site_header = "Project Catalyst Dashboard"
admin.site.site_title = "Project Catalyst Admin"
admin.site.index_title = "Welcome to Project Catalyst Admin"