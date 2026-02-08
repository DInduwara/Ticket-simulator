package com.personal.ticketsimulator.service;

import org.springframework.stereotype.Service;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

@Service
public class SimulationService {

    private ExecutorService executor;

    public synchronized void start(Runnable[] tasks) {
        if (executor != null && !executor.isShutdown()) {
            throw new IllegalStateException("Simulation already running");
        }
        executor = Executors.newCachedThreadPool();
        for (Runnable t : tasks) executor.submit(t);
    }

    public synchronized void stop() {
        if (executor != null) executor.shutdownNow();
    }
}
