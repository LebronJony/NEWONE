package com.example.history.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "dynasty")
public class Dynasty {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 50)
    private String name;

    @Column(length = 50)
    private String surname;

    @Column(length = 100)
    private String period;

    @Column(length = 100)
    private String capital;

    @Column(length = 50)
    private String founder;

    @Column(name = "last_ruler", length = 50)
    private String lastRuler;

    @Column(length = 50)
    private String duration;

    @Column(name = "year_start")
    private Integer yearStart;

    @Column(name = "year_end")
    private Integer yearEnd;

    @Column(columnDefinition = "TEXT")
    private String summary;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "family_tree", columnDefinition = "TEXT")
    private String familyTree;

    @Column(name = "sort_order")
    private Integer sortOrder;

    @Column(name = "image_gradient", length = 100)
    private String imageGradient;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getSurname() { return surname; }
    public void setSurname(String surname) { this.surname = surname; }
    public String getPeriod() { return period; }
    public void setPeriod(String period) { this.period = period; }
    public String getCapital() { return capital; }
    public void setCapital(String capital) { this.capital = capital; }
    public String getFounder() { return founder; }
    public void setFounder(String founder) { this.founder = founder; }
    public String getLastRuler() { return lastRuler; }
    public void setLastRuler(String lastRuler) { this.lastRuler = lastRuler; }
    public String getDuration() { return duration; }
    public void setDuration(String duration) { this.duration = duration; }
    public Integer getYearStart() { return yearStart; }
    public void setYearStart(Integer yearStart) { this.yearStart = yearStart; }
    public Integer getYearEnd() { return yearEnd; }
    public void setYearEnd(Integer yearEnd) { this.yearEnd = yearEnd; }
    public String getSummary() { return summary; }
    public void setSummary(String summary) { this.summary = summary; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getFamilyTree() { return familyTree; }
    public void setFamilyTree(String familyTree) { this.familyTree = familyTree; }
    public Integer getSortOrder() { return sortOrder; }
    public void setSortOrder(Integer sortOrder) { this.sortOrder = sortOrder; }
    public String getImageGradient() { return imageGradient; }
    public void setImageGradient(String imageGradient) { this.imageGradient = imageGradient; }
}
