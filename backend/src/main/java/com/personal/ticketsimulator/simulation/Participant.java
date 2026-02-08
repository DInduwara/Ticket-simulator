package com.personal.ticketsimulator.simulation;

import java.util.concurrent.atomic.AtomicBoolean;

public abstract class Participant implements Runnable {
    protected final AtomicBoolean running;

    protected Participant(AtomicBoolean running) {
        this.running = running;
    }
}
