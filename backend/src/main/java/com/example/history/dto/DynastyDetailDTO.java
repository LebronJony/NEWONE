package com.example.history.dto;

import com.example.history.entity.Dynasty;
import com.example.history.entity.Ruler;
import com.example.history.entity.RoyalMember;
import java.util.List;

public class DynastyDetailDTO {
    private Long id;
    private String name;
    private String surname;
    private String period;
    private String capital;
    private String founder;
    private String lastRuler;
    private String duration;
    private Integer yearStart;
    private Integer yearEnd;
    private String summary;
    private String description;
    private String familyTree;
    private String imageGradient;
    private List<Ruler> rulers;
    private List<RoyalMember> members;

    public static DynastyDetailDTO from(Dynasty d, List<Ruler> rulers, List<RoyalMember> members) {
        DynastyDetailDTO dto = new DynastyDetailDTO();
        dto.setId(d.getId());
        dto.setName(d.getName());
        dto.setSurname(d.getSurname());
        dto.setPeriod(d.getPeriod());
        dto.setCapital(d.getCapital());
        dto.setFounder(d.getFounder());
        dto.setLastRuler(d.getLastRuler());
        dto.setDuration(d.getDuration());
        dto.setYearStart(d.getYearStart());
        dto.setYearEnd(d.getYearEnd());
        dto.setSummary(d.getSummary());
        dto.setDescription(d.getDescription());
        dto.setFamilyTree(d.getFamilyTree());
        dto.setImageGradient(d.getImageGradient());
        dto.setRulers(rulers);
        dto.setMembers(members);
        return dto;
    }

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
    public String getImageGradient() { return imageGradient; }
    public void setImageGradient(String imageGradient) { this.imageGradient = imageGradient; }
    public List<Ruler> getRulers() { return rulers; }
    public void setRulers(List<Ruler> rulers) { this.rulers = rulers; }
    public List<RoyalMember> getMembers() { return members; }
    public void setMembers(List<RoyalMember> members) { this.members = members; }
}
