package com.personal.ticketsimulator.controller;

import com.personal.ticketsimulator.domain.SystemConfiguration;
import com.personal.ticketsimulator.repo.TicketSaleRepository;
import com.personal.ticketsimulator.service.ConfigService;
import com.personal.ticketsimulator.service.SimulationService;
import com.personal.ticketsimulator.service.messaging.RealtimePublisher;
import com.personal.ticketsimulator.simulation.*;
import org.springframework.web.bind.annotation.*;

import java.util.concurrent.atomic.AtomicBoolean;

@RestController
@RequestMapping("/api/sim")
public class SimulationController {

    private final SimulationService simulationService;
    private final ConfigService configService;
    private final RealtimePublisher publisher;
    private final TicketSaleRepository saleRepository;

    private final AtomicBoolean running = new AtomicBoolean(false);

    public SimulationController(SimulationService simulationService,
                                ConfigService configService,
                                RealtimePublisher publisher,
                                TicketSaleRepository saleRepository) {
        this.simulationService = simulationService;
        this.configService = configService;
        this.publisher = publisher;
        this.saleRepository = saleRepository;
    }

    @PostMapping("/start")
    public void start(@RequestParam(defaultValue = "2") int vendors,
                      @RequestParam(defaultValue = "8") int customers,
                      @RequestParam(defaultValue = "2") int vip) {

        if (running.get()) throw new IllegalStateException("Simulation already running");
        if (vip > customers) throw new IllegalArgumentException("vip cannot be greater than customers");
        if (vendors <= 0 || customers <= 0) throw new IllegalArgumentException("vendors/customers must be > 0");

        SystemConfiguration cfg = configService.latest();

        TicketPool pool = new TicketPool(cfg.getMaxTicketCapacity(), cfg.getTotalTickets());
        running.set(true);

        // Pass saleRepository to the factory
        Runnable[] tasks = SimulationFactory.build(
                pool, running, publisher, cfg, saleRepository, vendors, customers, vip
        );

        simulationService.start(tasks);

        publisher.log("SYSTEM", "SIM", "Started. vendors=" + vendors + ", customers=" + customers + ", vip=" + vip);
        publisher.status(pool);
    }

    @PostMapping("/stop")
    public void stop() {
        running.set(false);
        simulationService.stop();
        publisher.log("SYSTEM", "SIM", "Stopped.");
    }

    @GetMapping("/status")
    public String status() {
        return running.get() ? "RUNNING" : "STOPPED";
    }
}