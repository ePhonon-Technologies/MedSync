from django.urls import path
from .views import (
    RegisterView, LoginView, get_doctors, book_appointment, doctor_appointments,
    csrf_token_view, my_appointments,
    list_all_appointments, create_appointment_by_receptionist,
    update_appointment_by_receptionist, delete_appointment_by_receptionist
)
from .views import get_patients
from .views import get_doctors_by_specialization
from .views import get_audit_logs



urlpatterns = [
    path('csrf/', csrf_token_view),
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'), 
    path('doctors/', get_doctors, name='get_doctors'),
    path('admin/audit-logs/', get_audit_logs, name='get_audit_logs'),
    path('appointments/book/', book_appointment, name='book_appointment'),
    path('doctor-appointments/', doctor_appointments, name='doctor_appointments'),
    path('appointments/mine/', my_appointments),
    path('doctors/filter/', get_doctors_by_specialization, name='get_doctors_by_specialization'),


    # ✅ Receptionist endpoints
    path('receptionist/appointments/', list_all_appointments, name='list_appointments'),
    path('receptionist/appointments/create/', create_appointment_by_receptionist, name='create_appointment'),
    path('receptionist/appointments/update/<int:pk>/', update_appointment_by_receptionist, name='update_appointment'),
    path('receptionist/appointments/delete/<int:pk>/', delete_appointment_by_receptionist, name='delete_appointment'),
    path('receptionist/patients/', get_patients, name='get_patients'),
]
