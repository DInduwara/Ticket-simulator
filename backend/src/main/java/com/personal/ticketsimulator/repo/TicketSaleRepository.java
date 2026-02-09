package com.personal.ticketsimulator.repo;

import com.personal.ticketsimulator.domain.TicketSale;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TicketSaleRepository extends JpaRepository<TicketSale, Long> {
}