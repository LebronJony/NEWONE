package com.example.history.service;

import com.example.history.dto.DynastyDetailDTO;
import com.example.history.dto.DynastyListDTO;
import com.example.history.entity.Dynasty;
import com.example.history.entity.Ruler;
import com.example.history.entity.RulerChild;
import com.example.history.entity.RoyalMember;
import com.example.history.repository.DynastyRepository;
import com.example.history.repository.RulerChildRepository;
import com.example.history.repository.RulerRepository;
import com.example.history.repository.RoyalMemberRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DynastyService {

    private final DynastyRepository dynastyRepository;
    private final RulerRepository rulerRepository;
    private final RoyalMemberRepository memberRepository;
    private final RulerChildRepository childRepository;

    public DynastyService(DynastyRepository dynastyRepository,
                          RulerRepository rulerRepository,
                          RoyalMemberRepository memberRepository,
                          RulerChildRepository childRepository) {
        this.dynastyRepository = dynastyRepository;
        this.rulerRepository = rulerRepository;
        this.memberRepository = memberRepository;
        this.childRepository = childRepository;
    }

    public List<DynastyListDTO> getAllDynasties() {
        return dynastyRepository.findAllByOrderBySortOrderAsc()
                .stream().map(this::toListDTO)
                .collect(Collectors.toList());
    }

    public DynastyDetailDTO getDynastyDetail(Long id) {
        Dynasty d = dynastyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Dynasty not found: " + id));
        List<Ruler> rulers = rulerRepository.findByDynastyIdOrderByIdAsc(id);
        List<RoyalMember> members = memberRepository.findByDynastyIdOrderByIdAsc(id);
        return DynastyDetailDTO.from(d, rulers, members);
    }

    public List<Ruler> getRulers(Long dynastyId) {
        return rulerRepository.findByDynastyIdOrderByIdAsc(dynastyId);
    }

    public List<RoyalMember> getMembers(Long dynastyId) {
        return memberRepository.findByDynastyIdOrderByIdAsc(dynastyId);
    }

    public List<RulerChild> getChildren(Long rulerId) {
        return childRepository.findByRulerIdOrderBySortOrderAsc(rulerId);
    }

    private DynastyListDTO toListDTO(Dynasty d) {
        DynastyListDTO dto = new DynastyListDTO();
        dto.setId(d.getId());
        dto.setName(d.getName());
        dto.setSurname(d.getSurname());
        dto.setPeriod(d.getPeriod());
        dto.setFounder(d.getFounder());
        dto.setLastRuler(d.getLastRuler());
        dto.setYearStart(d.getYearStart());
        dto.setYearEnd(d.getYearEnd());
        dto.setSummary(d.getSummary());
        dto.setImageGradient(d.getImageGradient());
        return dto;
    }
}
