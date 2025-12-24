from django.urls import path
from . import views

urlpatterns = [
    # Static pages
    path("index/", views.index, name="index"),
    path("about/", views.about, name="about"),
    path("services/", views.services, name="services"),
    path("portfolio/", views.portfolio, name="portfolio"),
    path("webdev/", views.webdev, name="webdev"),
    path("uiux/", views.uiux, name="uiux"),
    path("graphicdesign/", views.graphicdesign, name="graphicdesign"),
    path("brandidentity/", views.brandidentity, name="brandidentity"),
    path("startproject/", views.startproject, name="startproject"),
    path("contact/", views.contact, name="contact"),
    path("admin_dashboard/", views.admin_dashboard, name="admin_dashboard"),
    path("project-catalyst/", views.project_catalyst_view, name="project_catalyst"),
    path("submit-project/", views.submit_project, name="submit_project"),
    path("", views.index, name="home"),
    # Contact form
    path("contact/", views.contact_view, name="contact"),
    # Project Catalyst form
    path("project-catalyst/", views.project_catalyst_view, name="project_catalyst"),
    path('submit-contact/', views.submit_contact, name='submit_contact'), 
]
