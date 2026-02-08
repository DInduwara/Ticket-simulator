package com.personal.ticketsimulator.service.messaging;

import com.personal.ticketsimulator.domain.events.LogEvent;
import com.personal.ticketsimulator.domain.events.TicketStatus;
import com.personal.ticketsimulator.simulation.TicketPool;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

import java.time.Instant;

@Component
public class RealtimePublisher {

    private final SimpMessagingTemplate ws;

    public RealtimePublisher(SimpMessagingTemplate ws) {
        this.ws = ws;
    }

    public void status(TicketPool pool) {
        ws.convertAndSend("/topic/status",
                new TicketStatus(
                        pool.available(),
                        pool.released(),
                        pool.sold(),
                        pool.maxCapacity(),
                        pool.totalLimit(),
                        Instant.now()
                )
        );
    }

    public void log(String actorType, String actorId, String message) {
        ws.convertAndSend("/topic/logs",
                new LogEvent(actorType, actorId, message, Instant.now())
        );
    }
}
