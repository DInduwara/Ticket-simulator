package com.personal.ticketsimulator.simulation;

import com.personal.ticketsimulator.service.messaging.RealtimePublisher;

import java.util.concurrent.atomic.AtomicBoolean;

public class RegularCustomer extends Customer {

    public RegularCustomer(
            String id,
            TicketPool pool,
            long intervalMs,
            AtomicBoolean running,
            RealtimePublisher publisher
    ) {
        super(id, pool, intervalMs, running, publisher);
    }

    @Override
    protected boolean isVip() {
        return false;
    }
}
