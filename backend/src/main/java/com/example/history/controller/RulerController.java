package com.example.history.controller;

import com.example.history.entity.Ruler;
import com.example.history.entity.RulerChild;
import com.example.history.repository.RulerRepository;
import com.example.history.service.DynastyService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/rulers")
public class RulerController {

    private final RulerRepository rulerRepository;
    private final DynastyService dynastyService;

    public RulerController(RulerRepository rulerRepository, DynastyService dynastyService) {
        this.rulerRepository = rulerRepository;
        this.dynastyService = dynastyService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<Ruler> getRuler(@PathVariable Long id) {
        return rulerRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/children")
    public ResponseEntity<List<RulerChild>> getChildren(@PathVariable Long id) {
        return ResponseEntity.ok(dynastyService.getChildren(id));
    }
}
