package com.personal.ticketsimulator.domain.events;

import java.time.Instant;

public record TicketStatus(
        int available,
        int totalReleased,
        int totalSold,
        int maxCapacity,
        int totalLimit,
        Instant at
) {}
