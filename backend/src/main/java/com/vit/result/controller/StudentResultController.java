package com.vit.result.controller;

import com.vit.result.model.StudentResult;
import com.vit.result.service.StudentResultService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/results")
public class StudentResultController {

    private final StudentResultService service;

    public StudentResultController(StudentResultService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<StudentResult> createResult(@Valid @RequestBody StudentResult studentResult) {
        StudentResult saved = service.createResult(studentResult);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @GetMapping
    public ResponseEntity<List<StudentResult>> getAllResults() {
        return ResponseEntity.ok(service.getAllResults());
    }

    @GetMapping("/{id}")
    public ResponseEntity<StudentResult> getResultById(@PathVariable String id) {
        return ResponseEntity.ok(service.getResultById(id));
    }

    @GetMapping("/register/{registrationNumber}")
    public ResponseEntity<StudentResult> getResultByRegistrationNumber(@PathVariable String registrationNumber) {
        return ResponseEntity.ok(service.getResultByRegistrationNumber(registrationNumber));
    }

    @PutMapping("/{id}")
    public ResponseEntity<StudentResult> updateResult(@PathVariable String id,
                                                        @Valid @RequestBody StudentResult studentResult) {
        return ResponseEntity.ok(service.updateResult(id, studentResult));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteResult(@PathVariable String id) {
        service.deleteResult(id);
        return ResponseEntity.noContent().build();
    }
}
