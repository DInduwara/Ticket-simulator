package com.personal.ticketsimulator.domain;

import com.personal.ticketsimulator.domain.enums.CustomerType;
import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "ticket_sales")
public class TicketSale {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String ticketId;
    private String customerId;
    
    @Enumerated(EnumType.STRING)
    private CustomerType customerType;
    
    private Instant soldAt;

    protected TicketSale() {}

    public TicketSale(String ticketId, String customerId, CustomerType customerType, Instant soldAt) {
        this.ticketId = ticketId;
        this.customerId = customerId;
        this.customerType = customerType;
        this.soldAt = soldAt;
    }

    public Long getId() { return id; }
    public String getTicketId() { return ticketId; }
    public String getCustomerId() { return customerId; }
    public CustomerType getCustomerType() { return customerType; }
    public Instant getSoldAt() { return soldAt; }
}