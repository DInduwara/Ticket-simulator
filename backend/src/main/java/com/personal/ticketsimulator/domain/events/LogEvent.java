package com.personal.ticketsimulator.domain.events;

import java.time.Instant;

public record LogEvent(
        String actorType,
        String actorId,
        String message,
        Instant at
) {}
