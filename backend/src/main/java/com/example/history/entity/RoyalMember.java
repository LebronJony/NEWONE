package com.example.history.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "royal_member")
public class RoyalMember {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "dynasty_id", nullable = false)
    private Long dynastyId;

    @Column(length = 100)
    private String name;

    @Column(length = 100)
    private String title;

    @Column(length = 50)
    private String lifespan;

    @Column(length = 20)
    private String role;

    @Column(columnDefinition = "TEXT")
    private String description;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getDynastyId() { return dynastyId; }
    public void setDynastyId(Long dynastyId) { this.dynastyId = dynastyId; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getLifespan() { return lifespan; }
    public void setLifespan(String lifespan) { this.lifespan = lifespan; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}
