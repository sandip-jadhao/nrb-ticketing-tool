package com.nibl.ticketing.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.nibl.ticketing.enums.Role;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User extends BaseEntity implements UserDetails {

    private String firstName;
    private String lastName;

    @Column(unique = true)
    private String email;

    private String mobileNo;

    private String password;

    private String department;
    private String designation;

    @Enumerated(EnumType.STRING)
    private Role role;

    // Automatically delete tickets created by this user
    @OneToMany(mappedBy = "createdBy", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    @Builder.Default
    private List<Ticket> createdTickets = new ArrayList<>();

    // Unlink tickets where this user was assigned as the engineer
    @OneToMany(mappedBy = "assignedEngineer")
    @JsonIgnore
    @Builder.Default
    private List<Ticket> assignedTickets = new ArrayList<>();

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(
                new SimpleGrantedAuthority(
                        "ROLE_" + role.name()
                )
        );
    }

    @Override
    public String getUsername() {
        return email;
    }
}