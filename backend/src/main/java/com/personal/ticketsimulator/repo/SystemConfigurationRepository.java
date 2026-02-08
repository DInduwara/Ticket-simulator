package com.personal.ticketsimulator.repo;

import com.personal.ticketsimulator.domain.SystemConfiguration;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SystemConfigurationRepository
        extends JpaRepository<SystemConfiguration, Long> {}
