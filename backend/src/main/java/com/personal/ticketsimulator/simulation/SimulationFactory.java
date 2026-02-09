package com.personal.ticketsimulator.simulation;

import com.personal.ticketsimulator.domain.SystemConfiguration;
import com.personal.ticketsimulator.repo.TicketSaleRepository;
import com.personal.ticketsimulator.service.messaging.RealtimePublisher;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicBoolean;

public class SimulationFactory {

    private SimulationFactory() {}

    public static Runnable[] build(
            TicketPool pool,
            AtomicBoolean running,
            RealtimePublisher publisher,
            SystemConfiguration cfg,
            TicketSaleRepository saleRepository,
            int vendorCount,
            int customerCount,
            int vipCount
    ) {
        List<Runnable> tasks = new ArrayList<>();

        // Vendors
        for (int i = 1; i <= vendorCount; i++) {
            tasks.add(new Vendor(
                    "V" + i,
                    pool,
                    cfg.getTicketReleaseRate(),
                    1000,
                    running,
                    publisher
            ));
        }

        // VIP customers
        long vipDelay = Math.max(100, cfg.getCustomerRetrievalRate() / 2);
        for (int i = 1; i <= vipCount; i++) {
            tasks.add(new VipCustomer(
                    "VIP" + i,
                    pool,
                    vipDelay,
                    running,
                    publisher,
                    saleRepository
            ));
        }

        // Regular customers
        int regular = Math.max(0, customerCount - vipCount);
        for (int i = 1; i <= regular; i++) {
            tasks.add(new RegularCustomer(
                    "C" + i,
                    pool,
                    cfg.getCustomerRetrievalRate(),
                    running,
                    publisher,
                    saleRepository
            ));
        }

        return tasks.toArray(new Runnable[0]);
    }
}