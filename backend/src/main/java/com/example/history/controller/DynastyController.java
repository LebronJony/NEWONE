package com.example.history.controller;

import com.example.history.dto.DynastyDetailDTO;
import com.example.history.dto.DynastyListDTO;
import com.example.history.entity.Ruler;
import com.example.history.entity.RoyalMember;
import com.example.history.service.DynastyService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/dynasties")
public class DynastyController {

    private final DynastyService dynastyService;

    public DynastyController(DynastyService dynastyService) {
        this.dynastyService = dynastyService;
    }

    @GetMapping
    public ResponseEntity<List<DynastyListDTO>> getAll() {
        return ResponseEntity.ok(dynastyService.getAllDynasties());
    }

    @GetMapping("/{id}")
    public ResponseEntity<DynastyDetailDTO> getDetail(@PathVariable Long id) {
        return ResponseEntity.ok(dynastyService.getDynastyDetail(id));
    }

    @GetMapping("/{id}/rulers")
    public ResponseEntity<List<Ruler>> getRulers(@PathVariable Long id) {
        return ResponseEntity.ok(dynastyService.getRulers(id));
    }

    @GetMapping("/{id}/members")
    public ResponseEntity<List<RoyalMember>> getMembers(@PathVariable Long id) {
        return ResponseEntity.ok(dynastyService.getMembers(id));
    }
}
