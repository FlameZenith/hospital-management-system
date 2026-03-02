package com.hospital.hms.billing.service;

import com.hospital.hms.appointment.model.Appointment;
import com.hospital.hms.appointment.repository.AppointmentRepository;
import com.hospital.hms.billing.model.Bill;
import com.hospital.hms.billing.repository.BillingRepository;
import com.hospital.hms.patient.model.Patient;
import com.hospital.hms.patient.service.PatientService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BillingService {

    private final BillingRepository billingRepository;
    private final PatientService patientService;
    private final AppointmentRepository appointmentRepository; // We can use repository or service here. Service is better for loose coupling in a true modular monolith, but we'll keep it simple for now.

    public List<Bill> getAllBills() {
        return billingRepository.findAll();
    }

    public List<Bill> getBillsByPatient(Long patientId) {
        return billingRepository.findByPatientId(patientId);
    }

    public Bill generateBill(Long patientId, Long appointmentId, Double amount) {
        Patient patient = patientService.getPatientById(patientId);
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        Bill bill = new Bill();
        bill.setPatient(patient);
        bill.setAppointment(appointment);
        bill.setTotalAmount(amount);
        bill.setStatus("UNPAID");
        bill.setGeneratedAt(LocalDateTime.now());

        return billingRepository.save(bill);
    }

    public Bill payBill(Long id) {
        Bill bill = billingRepository.findById(id).orElseThrow(() -> new RuntimeException("Bill not found"));
        bill.setStatus("PAID");
        return billingRepository.save(bill);
    }
}
