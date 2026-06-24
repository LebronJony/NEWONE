package com.example.history.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "ruler_child")
public class RulerChild {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "ruler_id", nullable = false)
    private Long rulerId;

    @Column(length = 100)
    private String name;

    @Column(length = 100)
    private String title;

    @Column(length = 100)
    private String mother;

    @Column(columnDefinition = "TEXT")
    private String deeds;

    @Column(columnDefinition = "TEXT")
    private String fate;

    @Column(name = "sort_order")
    private Integer sortOrder;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getRulerId() { return rulerId; }
    public void setRulerId(Long rulerId) { this.rulerId = rulerId; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getMother() { return mother; }
    public void setMother(String mother) { this.mother = mother; }
    public String getDeeds() { return deeds; }
    public void setDeeds(String deeds) { this.deeds = deeds; }
    public String getFate() { return fate; }
    public void setFate(String fate) { this.fate = fate; }
    public Integer getSortOrder() { return sortOrder; }
    public void setSortOrder(Integer sortOrder) { this.sortOrder = sortOrder; }
}
