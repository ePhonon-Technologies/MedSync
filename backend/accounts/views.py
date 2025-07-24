from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import login
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from .serializers import AppointmentUpdateSerializer

from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from datetime import date
from rest_framework.permissions import AllowAny

from .models import Profile, Appointment, AuditLog
from .serializers import RegisterSerializer, AppointmentSerializer
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import ensure_csrf_cookie
from django.http import JsonResponse

# Set CSRF token
@ensure_csrf_cookie
def csrf_token_view(request):
    return JsonResponse({'message': 'CSRF token set'})

# Register user
@method_decorator(csrf_exempt, name='dispatch')
class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            role = request.data.get("role", "patient")
            Profile.objects.get_or_create(user=user, role=role)
            return Response({"message": "User registered successfully"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Login user
@method_decorator(csrf_exempt, name='dispatch')
class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")
        user = authenticate(username=username, password=password)

        if user:
            try:
                profile = Profile.objects.get(user=user)
                login(request, user)
                return Response({
                    "message": "Login successful",
                    "role": profile.role,
                    "username": user.username
                }, status=status.HTTP_200_OK)
            except Profile.DoesNotExist:
                return Response({"error": "Profile not found"}, status=404)
        return Response({"error": "Invalid credentials"}, status=401)

# Get doctors
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_doctors(request):
    doctors = Profile.objects.filter(role='doctor').select_related('user')
    doctor_data = [{'id': d.user.id, 'name': d.user.username} for d in doctors]
    return Response(doctor_data)

# Book appointment (patient)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def book_appointment(request):
    data = request.data.copy()
    data['patient'] = request.user.id
    serializer = AppointmentSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Appointment booked successfully"}, status=201)
    return Response(serializer.errors, status=400)

# Doctor appointments
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def doctor_appointments(request):
    if not Profile.objects.filter(user=request.user, role='doctor').exists():
        return Response({"error": "Access denied"}, status=403)

    appointments = Appointment.objects.filter(doctor=request.user).select_related('patient')
    data = [{
        "patient": appt.patient.username,
        "date": appt.date,
        "time": appt.time.strftime('%H:%M')
    } for appt in appointments]
    return Response(data)

# Patient appointments
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_appointments(request):
    appointments = Appointment.objects.filter(patient=request.user).select_related('doctor')
    data = [{
        'id': appt.id,
        'date': appt.date,
        'time': appt.time,
        'doctor_name': appt.doctor.username
    } for appt in appointments]
    return Response(data)

# Receptionist views all appointments
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_all_appointments(request):
    if not Profile.objects.filter(user=request.user, role='receptionist').exists():
        return Response({"error": "Unauthorized"}, status=403)

    appointments = Appointment.objects.select_related('patient', 'doctor').all()
    data = [{
        "id": appt.id,
        "patient": appt.patient.username,
        "doctor": appt.doctor.username,
        "date": appt.date,
        "time": appt.time.strftime('%H:%M')
    } for appt in appointments]
    return Response(data)

# Receptionist creates appointment
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_appointment_by_receptionist(request):
    if not Profile.objects.filter(user=request.user, role='receptionist').exists():
        return Response({"error": "Unauthorized"}, status=403)

    serializer = AppointmentSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        # Audit log
        AuditLog.objects.create(user=request.user, action='create', ref_id=serializer.instance.id)
        return Response({"message": "Appointment created"}, status=201)
    return Response(serializer.errors, status=400)

# Receptionist updates appointment
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_appointment_by_receptionist(request, pk):
    if not Profile.objects.filter(user=request.user, role='receptionist').exists():
        return Response({"error": "Unauthorized"}, status=403)

    try:
        appt = Appointment.objects.get(pk=pk)
    except Appointment.DoesNotExist:
        return Response({"error": "Appointment not found"}, status=404)

    serializer = AppointmentUpdateSerializer(appt, data=request.data)
    if serializer.is_valid():
        serializer.save()
        # Audit log
        AuditLog.objects.create(user=request.user, action='update', ref_id=serializer.instance.id)
        return Response({"message": "Appointment updated"})
    return Response(serializer.errors, status=400)

# Receptionist deletes appointment
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_appointment_by_receptionist(request, pk):
    if not Profile.objects.filter(user=request.user, role='receptionist').exists():
        return Response({"error": "Unauthorized"}, status=403)

    try:
        appt = Appointment.objects.get(pk=pk)
        # Audit log before delete
        AuditLog.objects.create(user=request.user, action='delete', ref_id=appt.id)
        appt.delete()
        return Response({"message": "Appointment deleted"})
    except Appointment.DoesNotExist:
        return Response({"error": "Appointment not found"}, status=404)

# Get patients (for receptionist)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_patients(request):
    if not Profile.objects.filter(user=request.user, role='receptionist').exists():
        return Response({"error": "Unauthorized"}, status=403)

    patients = Profile.objects.filter(role='patient').select_related('user')
    data = [{"id": p.user.id, "name": p.user.username} for p in patients]
    return Response(data)

# Filter doctors by specialization
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_doctors_by_specialization(request):
    specialization = request.GET.get('specialization')
    if not specialization:
        return Response({"error": "Specialization required"}, status=400)

    doctors = Profile.objects.filter(role='doctor', specialization=specialization).select_related('user')
    data = [{"id": d.user.id, "username": d.user.username, "specialization": d.specialization} for d in doctors]
    return Response(data)

# View audit logs (admin-only)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_audit_logs(request):
    if not request.user.is_staff:
        return Response({"error": "Access denied"}, status=403)

    logs = AuditLog.objects.select_related('user').order_by('-timestamp')[:100]
    data = [{
        "user": log.user.username,
        "action": log.action,
        "ref_id": log.ref_id,
        "timestamp": log.timestamp.strftime('%Y-%m-%d %H:%M:%S')
    } for log in logs]
    return Response(data)
