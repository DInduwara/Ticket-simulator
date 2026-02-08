package com.personal.ticketsimulator.domain;

import java.time.Instant;
import java.util.UUID;

public class Ticket {
    private final String id = UUID.randomUUID().toString();
    private final Instant createdAt = Instant.now();

    public String getId() { return id; }
    public Instant getCreatedAt() { return createdAt; }
}
