package com.personal.ticketsimulator.simulation;

import com.personal.ticketsimulator.service.messaging.RealtimePublisher;

import java.util.concurrent.atomic.AtomicBoolean;

public abstract class Customer extends Participant {

    protected final String id;
    protected final TicketPool pool;
    protected final long intervalMs;
    protected final RealtimePublisher publisher;

    protected Customer(
            String id,
            TicketPool pool,
            long intervalMs,
            AtomicBoolean running,
            RealtimePublisher publisher
    ) {
        super(running);
        this.id = id;
        this.pool = pool;
        this.intervalMs = intervalMs;
        this.publisher = publisher;
    }

    protected abstract boolean isVip();

    @Override
    public void run() {
        while (running.get()) {
            try {
                pool.removeOne(isVip()).ifPresent(ticket -> {
                    publisher.log(isVip() ? "VIP" : "CUSTOMER", id,
                            "Purchased ticket " + ticket.getId());
                    publisher.status(pool);
                });
                Thread.sleep(intervalMs);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }
    }
}
