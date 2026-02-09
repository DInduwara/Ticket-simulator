package com.personal.ticketsimulator.simulation;

import com.personal.ticketsimulator.domain.TicketSale;
import com.personal.ticketsimulator.domain.enums.CustomerType;
import com.personal.ticketsimulator.repo.TicketSaleRepository;
import com.personal.ticketsimulator.service.messaging.RealtimePublisher;

import java.time.Instant;
import java.util.concurrent.atomic.AtomicBoolean;

public abstract class Customer extends Participant {

    protected final String id;
    protected final TicketPool pool;
    protected final long intervalMs;
    protected final RealtimePublisher publisher;
    protected final TicketSaleRepository saleRepository;

    protected Customer(
            String id,
            TicketPool pool,
            long intervalMs,
            AtomicBoolean running,
            RealtimePublisher publisher,
            TicketSaleRepository saleRepository
    ) {
        super(running);
        this.id = id;
        this.pool = pool;
        this.intervalMs = intervalMs;
        this.publisher = publisher;
        this.saleRepository = saleRepository;
    }

    protected abstract CustomerType getType();

    @Override
    public void run() {
        while (running.get()) {
            try {
                boolean isVip = (getType() == CustomerType.VIP);
                pool.removeOne(isVip).ifPresent(ticket -> {
                    // 1. Log to WebSocket (Real-time UI)
                    publisher.log(isVip ? "VIP" : "CUSTOMER", id, "Purchased ticket " + ticket.getId());
                    publisher.status(pool);

                    // 2. Save to MySQL (Persistence Bonus)
                    TicketSale sale = new TicketSale(
                            ticket.getId(),
                            id,
                            getType(),
                            Instant.now()
                    );
                    saleRepository.save(sale);
                });
                Thread.sleep(intervalMs);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }
    }
}