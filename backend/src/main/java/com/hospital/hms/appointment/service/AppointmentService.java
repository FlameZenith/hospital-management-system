package com.hospital.hms.appointment.service;

import com.hospital.hms.appointment.model.Appointment;
import com.hospital.hms.appointment.repository.AppointmentRepository;
import com.hospital.hms.patient.model.Patient;
import com.hospital.hms.patient.service.PatientService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final PatientService patientService; // Modular approach: calls Patient's service

    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAll();
    }

    public List<Appointment> getAppointmentsByPatient(Long patientId) {
        return appointmentRepository.findByPatientId(patientId);
    }

    public Appointment createAppointment(Appointment appointment, Long patientId) {
        // Enforce strong consistency using the other module
        Patient patient = patientService.getPatientById(patientId);
        appointment.setPatient(patient);
        appointment.setStatus("SCHEDULED");
        return appointmentRepository.save(appointment);
    }
    
    public Appointment updateStatus(Long id, String status) {
        Appointment apt = appointmentRepository.findById(id).orElseThrow(() -> new RuntimeException("Appointment not found"));
        apt.setStatus(status);
        return appointmentRepository.save(apt);
    }
}
