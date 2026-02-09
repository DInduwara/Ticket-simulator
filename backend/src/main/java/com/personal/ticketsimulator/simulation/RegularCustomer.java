package com.personal.ticketsimulator.simulation;

import com.personal.ticketsimulator.domain.enums.CustomerType;
import com.personal.ticketsimulator.repo.TicketSaleRepository;
import com.personal.ticketsimulator.service.messaging.RealtimePublisher;
import java.util.concurrent.atomic.AtomicBoolean;

public class RegularCustomer extends Customer {

    public RegularCustomer(
            String id,
            TicketPool pool,
            long intervalMs,
            AtomicBoolean running,
            RealtimePublisher publisher,
            TicketSaleRepository repo
    ) {
        super(id, pool, intervalMs, running, publisher, repo);
    }

    @Override
    protected CustomerType getType() {
        return CustomerType.REGULAR;
    }
}