package com.personal.ticketsimulator.service;

import com.personal.ticketsimulator.domain.SystemConfiguration;
import com.personal.ticketsimulator.repo.SystemConfigurationRepository;
import org.springframework.stereotype.Service;

@Service
public class ConfigService {

    private final SystemConfigurationRepository repo;

    public ConfigService(SystemConfigurationRepository repo) {
        this.repo = repo;
    }

    public SystemConfiguration save(SystemConfiguration cfg) {
        validate(cfg);
        return repo.save(cfg);
    }

    public SystemConfiguration latest() {
        return repo.findAll()
                .stream()
                .reduce((first, second) -> second)
                .orElseThrow(() ->
                        new IllegalStateException("No configuration found"));
    }

    private void validate(SystemConfiguration cfg) {
        if (cfg.getTotalTickets() <= 0)
            throw new IllegalArgumentException("Total tickets must be > 0");
        if (cfg.getMaxTicketCapacity() <= 0)
            throw new IllegalArgumentException("Max capacity must be > 0");
        if (cfg.getTicketReleaseRate() <= 0)
            throw new IllegalArgumentException("Release rate must be > 0");
        if (cfg.getCustomerRetrievalRate() <= 0)
            throw new IllegalArgumentException("Retrieval rate must be > 0");
    }
}
