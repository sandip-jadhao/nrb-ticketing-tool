package com.nibl.ticketing.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.nibl.ticketing.enums.Priority;
import com.nibl.ticketing.enums.TicketStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.LocalDateTime;

@Entity
@Table(name = "tickets")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Ticket extends BaseEntity {

    private String title;

    @Column(length = 2000)
    private String description;

    @Enumerated(EnumType.STRING)
    private Priority priority;

    @Enumerated(EnumType.STRING)
    private TicketStatus status;
    
    @Column(name = "attachment_path")
    private String attachmentPath;

    private LocalDateTime resolvedAt;

    @ManyToOne
    @JoinColumn(name = "created_by")
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JsonIgnoreProperties({"createdTickets", "assignedTickets", "password", "authorities"})
    private User createdBy;

    @ManyToOne
    @JoinColumn(name = "assigned_to")
    @OnDelete(action = OnDeleteAction.SET_NULL)
    @JsonIgnoreProperties({"createdTickets", "assignedTickets", "password", "authorities"})
    private User assignedEngineer;
}