from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Profile, Appointment

class RegisterSerializer(serializers.ModelSerializer):
    role = serializers.ChoiceField(choices=Profile.ROLE_CHOICES, write_only=True)
    specialization = serializers.ChoiceField(
        choices=Profile.SPECIALIZATION_CHOICES,
        required=False,
        allow_blank=True,
        allow_null=True
    )

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'role', 'specialization']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        role = validated_data.pop('role')
        specialization = validated_data.pop('specialization', None)

        user = User.objects.create_user(**validated_data)

        if role == 'doctor':
            Profile.objects.create(user=user, role=role, specialization=specialization)
        else:
            Profile.objects.create(user=user, role=role)

        return user

class AppointmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appointment
        fields = '__all__'

class AppointmentUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appointment
        fields = ['id', 'patient', 'doctor', 'date', 'time']
