package com.example.history.controller;

import com.example.history.entity.RoyalMember;
import com.example.history.repository.RoyalMemberRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/members")
public class MemberController {

    private final RoyalMemberRepository memberRepository;

    public MemberController(RoyalMemberRepository memberRepository) {
        this.memberRepository = memberRepository;
    }

    @GetMapping("/{id}")
    public ResponseEntity<RoyalMember> getMember(@PathVariable Long id) {
        return memberRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
