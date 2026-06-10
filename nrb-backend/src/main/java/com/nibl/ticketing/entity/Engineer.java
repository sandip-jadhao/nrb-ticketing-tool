package com.nibl.ticketing.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "engineers")
@Getter
@Setter
public class Engineer extends BaseEntity {

    private String employeeCode;

    private String skillSet;

    private Integer experienceYears;

    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;
}
