package com.personal.ticketsimulator.simulation;

import com.personal.ticketsimulator.service.messaging.RealtimePublisher;
import java.util.concurrent.atomic.AtomicBoolean;

public class Vendor extends Participant {

    private final String id;
    private final TicketPool pool;
    private final int releaseRate; // Tickets per batch
    private final long intervalMs; // Time between batches
    private final RealtimePublisher publisher;

    public Vendor(
            String id,
            TicketPool pool,
            int releaseRate,
            long intervalMs,
            AtomicBoolean running,
            RealtimePublisher publisher
    ) {
        super(running);
        this.id = id;
        this.pool = pool;
        this.releaseRate = releaseRate;
        this.intervalMs = intervalMs;
        this.publisher = publisher;
    }

    @Override
    public void run() {
        while (running.get()) {
            try {
                for (int i = 0; i < releaseRate; i++) {
                    boolean added = pool.addOne();
                    if (!added) {
                        publisher.log("VENDOR", id, "Ticket limit reached. Vendor stopping.");
                        // CRITICAL FIX: Return to stop THIS thread, do not set running=false
                        return; 
                    }
                    publisher.log("VENDOR", id, "Released ticket");
                    publisher.status(pool);
                }
                Thread.sleep(intervalMs);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                break;
            }
        }
    }
}