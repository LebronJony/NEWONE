package com.example.history.dto;

public class DynastyListDTO {
    private Long id;
    private String name;
    private String surname;
    private String period;
    private String founder;
    private String lastRuler;
    private Integer yearStart;
    private Integer yearEnd;
    private String summary;
    private String imageGradient;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getSurname() { return surname; }
    public void setSurname(String surname) { this.surname = surname; }
    public String getPeriod() { return period; }
    public void setPeriod(String period) { this.period = period; }
    public String getFounder() { return founder; }
    public void setFounder(String founder) { this.founder = founder; }
    public String getLastRuler() { return lastRuler; }
    public void setLastRuler(String lastRuler) { this.lastRuler = lastRuler; }
    public Integer getYearStart() { return yearStart; }
    public void setYearStart(Integer yearStart) { this.yearStart = yearStart; }
    public Integer getYearEnd() { return yearEnd; }
    public void setYearEnd(Integer yearEnd) { this.yearEnd = yearEnd; }
    public String getSummary() { return summary; }
    public void setSummary(String summary) { this.summary = summary; }
    public String getImageGradient() { return imageGradient; }
    public void setImageGradient(String imageGradient) { this.imageGradient = imageGradient; }
}
