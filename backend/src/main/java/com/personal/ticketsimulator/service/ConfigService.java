package com.personal.ticketsimulator.service;

import com.personal.ticketsimulator.domain.SystemConfiguration;
import com.personal.ticketsimulator.repo.SystemConfigurationRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class ConfigService {

    private final SystemConfigurationRepository repo;

    public ConfigService(SystemConfigurationRepository repo) {
        this.repo = repo;
    }

    public SystemConfiguration save(SystemConfiguration cfg) {
        validate(cfg);
        
        // CRITICAL FIX: Update existing config if it exists, otherwise create new
        Optional<SystemConfiguration> existing = repo.findAll().stream().findFirst();
        
        if (existing.isPresent()) {
            SystemConfiguration dbConfig = existing.get();
            dbConfig.setTotalTickets(cfg.getTotalTickets());
            dbConfig.setMaxTicketCapacity(cfg.getMaxTicketCapacity());
            dbConfig.setTicketReleaseRate(cfg.getTicketReleaseRate());
            dbConfig.setCustomerRetrievalRate(cfg.getCustomerRetrievalRate());
            return repo.save(dbConfig);
        } else {
            return repo.save(cfg);
        }
    }

    public SystemConfiguration latest() {
        return repo.findAll()
                .stream()
                .findFirst() // Just get the first one since we now only maintain one
                .orElseThrow(() -> new IllegalStateException("No configuration found. Please save configuration first."));
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