package com.vit.result.model;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Root document stored in the "student_results" collection in MongoDB.
 * Holds one semester's result for one VIT student across exactly four subjects.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "student_results")
public class StudentResult {

    @Id
    private String id;

    @NotBlank(message = "Student name is required")
    private String studentName;

    @NotBlank(message = "Registration number is required")
    @Indexed(unique = true)
    private String registrationNumber;

    @NotBlank(message = "Branch/School is required")
    private String branch;

    @NotBlank(message = "Semester is required")
    private String semester;

    @NotEmpty(message = "At least one subject is required")
    @Size(min = 4, max = 4, message = "Exactly four subjects are required")
    @Valid
    private List<Subject> subjects;

    // ---- Computed / derived fields (set by the service layer) ----
    private Double totalMarks;        // sum of subjectTotal across all subjects (out of 400)
    private Double percentage;        // average percentage across subjects
    private Double sgpa;              // semester grade point average (10 point scale)
    private String overallGrade;
    private String overallResult;     // "PASS" or "FAIL"

    @CreatedDate
    private LocalDateTime createdAt;
}
