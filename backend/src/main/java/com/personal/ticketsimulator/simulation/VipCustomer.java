package com.personal.ticketsimulator.simulation;

import com.personal.ticketsimulator.service.messaging.RealtimePublisher;

import java.util.concurrent.atomic.AtomicBoolean;

public class VipCustomer extends Customer {

    public VipCustomer(
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
        return true;
    }
}
