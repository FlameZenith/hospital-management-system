package com.hospital.hms.billing.controller;

import com.hospital.hms.billing.model.Bill;
import com.hospital.hms.billing.service.BillingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bills")
@RequiredArgsConstructor
public class BillingController {

    private final BillingService billingService;

    @GetMapping
    public ResponseEntity<List<Bill>> getAllBills() {
        return ResponseEntity.ok(billingService.getAllBills());
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<Bill>> getBillsByPatient(@PathVariable Long patientId) {
        return ResponseEntity.ok(billingService.getBillsByPatient(patientId));
    }

    @PostMapping("/generate")
    public ResponseEntity<Bill> generateBill(@RequestParam Long patientId, @RequestParam Long appointmentId, @RequestParam Double amount) {
        return ResponseEntity.ok(billingService.generateBill(patientId, appointmentId, amount));
    }

    @PutMapping("/{id}/pay")
    public ResponseEntity<Bill> payBill(@PathVariable Long id) {
        return ResponseEntity.ok(billingService.payBill(id));
    }
}
