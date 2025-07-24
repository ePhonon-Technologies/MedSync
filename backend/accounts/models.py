from django.db import models
from django.contrib.auth.models import User

class Profile(models.Model):
    ROLE_CHOICES = (
        ('patient', 'Patient'),
        ('doctor', 'Doctor'),
        ('receptionist', 'Receptionist'),
    )
    SPECIALIZATION_CHOICES = (
        ('general', 'General Physician'),
        ('cardiology', 'Cardiologist'),
        ('dermatology', 'Dermatologist'),
        ('neurology', 'Neurologist'),
        ('pediatrics', 'Pediatrician'),
        # add more as needed
    )
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    specialization = models.CharField(max_length=50, choices=SPECIALIZATION_CHOICES, null=True, blank=True)


    def __str__(self):
        return f"{self.user.username} - {self.role}"
    
    
class Appointment(models.Model):
    patient = models.ForeignKey(User, related_name='patient_appointments', on_delete=models.CASCADE)
    doctor = models.ForeignKey(User, related_name='doctor_appointments', on_delete=models.CASCADE)
    date = models.DateField()
    time = models.TimeField()

    def __str__(self):
        return f"{self.patient.username} → {self.doctor.username} on {self.date} at {self.time}"

class AuditLog(models.Model):
    ACTION_CHOICES = (
        ('create', 'Create'),
        ('update', 'Update'),
        ('delete', 'Delete'),
    )
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    action = models.CharField(max_length=10, choices=ACTION_CHOICES)
    ref_id = models.IntegerField(help_text="Related Appointment ID")
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.action} - {self.ref_id} - {self.timestamp}"