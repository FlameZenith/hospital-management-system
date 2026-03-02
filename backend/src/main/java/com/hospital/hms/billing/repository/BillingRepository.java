package com.hospital.hms.billing.repository;

import com.hospital.hms.billing.model.Bill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BillingRepository extends JpaRepository<Bill, Long> {
    List<Bill> findByPatientId(Long patientId);
}
