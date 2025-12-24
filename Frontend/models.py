# core/models.py (or Frontend/models.py depending on your app structure)
from django.db import models
from django.utils import timezone

class ProjectSubmission(models.Model):
    PROJECT_TYPES = [
        ('web', 'Web Development'),
        ('uiux', 'UI/UX Design'),
        ('brand', 'Brand Identity'),
        ('graphic', 'Graphic Design'),
        ('other', 'Something Else'),
    ]
    
    TIMELINE_CHOICES = [
        ('urgent', 'Urgent (1-2 weeks)'),
        ('standard', 'Standard (3-6 weeks)'),
        ('flexible', 'Flexible (6+ weeks)'),
    ]
    
    REFERENCE_CHOICES = [
        ('search', 'Search Engine'),
        ('social', 'Social Media'),
        ('referral', 'Referral'),
        ('portfolio', 'Portfolio'),
        ('other', 'Other'),
    ]
    
    # Step 1: Project Type
    project_type = models.CharField(max_length=20, choices=PROJECT_TYPES)
    
    # Step 2: Project Details
    client_name = models.CharField(max_length=200)
    email = models.EmailField()
    company = models.CharField(max_length=200, blank=True, null=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    project_title = models.CharField(max_length=200)
    project_description = models.TextField()
    
    # Step 3: Requirements
    budget = models.DecimalField(max_digits=10, decimal_places=2)
    timeline = models.CharField(max_length=20, choices=TIMELINE_CHOICES)
    reference_links = models.TextField(blank=True, null=True)
    
    # Step 4: Final Step
    heard_from = models.CharField(max_length=20, choices=REFERENCE_CHOICES, blank=True, null=True)
    additional_notes = models.TextField(blank=True, null=True)
    attached_files = models.TextField(blank=True, null=True)  # Store file paths as JSON
    
    # Status and Metadata
    status = models.CharField(
        max_length=20,
        default='pending',
        choices=[
            ('pending', 'Pending Review'),
            ('reviewed', 'Reviewed'),
            ('contacted', 'Contacted'),
            ('accepted', 'Project Accepted'),
            ('rejected', 'Project Rejected'),
        ]
    )
    notes = models.TextField(blank=True, null=True)  # Internal notes
    
    # Timestamps - THESE ARE MODEL FIELDS, NOT META ATTRIBUTES
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    submitted_at = models.DateTimeField(default=timezone.now)
    
    # Meta class - ONLY contains metadata ABOUT the model
    class Meta:
        ordering = ['-submitted_at']
        verbose_name = 'Project Submission'
        verbose_name_plural = 'Project Submissions'
    
    def __str__(self):
        return f"{self.project_title} - {self.client_name}"
    
    def get_project_type_display(self):
        """Get human-readable project type"""
        return dict(self.PROJECT_TYPES).get(self.project_type, self.project_type)
    
    def get_timeline_display(self):
        """Get human-readable timeline"""
        return dict(self.TIMELINE_CHOICES).get(self.timeline, self.timeline)
    
    def get_status_display(self):
        """Get human-readable status"""
        status_dict = {
            'pending': 'Pending Review',
            'reviewed': 'Reviewed',
            'contacted': 'Contacted',
            'accepted': 'Project Accepted',
            'rejected': 'Project Rejected',
        }
        display_text = status_dict.get(self.status, self.status)
        return display_text.upper() if self.status in status_dict else display_text


class ContactMessage(models.Model):
    # Contact form fields
    name = models.CharField(max_length=200)
    email = models.EmailField()
    subject = models.CharField(max_length=200)
    message = models.TextField()
    
    # Status fields
    is_read = models.BooleanField(default=False)
    is_archived = models.BooleanField(default=False)
    
    # Timestamps - MODEL FIELDS
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    submitted_at = models.DateTimeField(default=timezone.now)
    
    # Meta class
    class Meta:
        ordering = ['-submitted_at']
        verbose_name = 'Contact Message'
        verbose_name_plural = 'Contact Messages'
    
    def __str__(self):
        return f"{self.subject} - {self.name}"