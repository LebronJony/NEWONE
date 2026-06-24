package com.example.history.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "ruler")
public class Ruler {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "dynasty_id", nullable = false)
    private Long dynastyId;

    @Column(length = 50)
    private String title;

    @Column(length = 50)
    private String name;

    @Column(name = "reign_start", length = 30)
    private String reignStart;

    @Column(name = "reign_end", length = 30)
    private String reignEnd;

    @Column(length = 100)
    private String relation;

    @Column(columnDefinition = "TEXT")
    private String achievements;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getDynastyId() { return dynastyId; }
    public void setDynastyId(Long dynastyId) { this.dynastyId = dynastyId; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getReignStart() { return reignStart; }
    public void setReignStart(String reignStart) { this.reignStart = reignStart; }
    public String getReignEnd() { return reignEnd; }
    public void setReignEnd(String reignEnd) { this.reignEnd = reignEnd; }
    public String getRelation() { return relation; }
    public void setRelation(String relation) { this.relation = relation; }
    public String getAchievements() { return achievements; }
    public void setAchievements(String achievements) { this.achievements = achievements; }
}
