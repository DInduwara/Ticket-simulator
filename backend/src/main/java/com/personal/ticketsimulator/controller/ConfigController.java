package com.personal.ticketsimulator.controller;

import com.personal.ticketsimulator.domain.SystemConfiguration;
import com.personal.ticketsimulator.service.ConfigService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/config")
public class ConfigController {

    private final ConfigService configService;

    public ConfigController(ConfigService configService) {
        this.configService = configService;
    }

    /**
     * Save system configuration to SQLite
     */
    @PostMapping
    public SystemConfiguration saveConfig(
            @Valid @RequestBody SystemConfiguration config
    ) {
        return configService.save(config);
    }

    /**
     * Get latest saved configuration
     */
    @GetMapping("/latest")
    public SystemConfiguration getLatestConfig() {
        return configService.latest();
    }
}
