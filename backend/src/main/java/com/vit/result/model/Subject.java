package com.vit.result.model;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Represents a single subject with MSE (Mid Semester Exam, out of 50, weighted 30%)
 * and ESE (End Semester Exam, out of 100, weighted 70%) marks.
 *
 * subjectTotal   = (mseMarks / 50 * 30) + (eseMarks / 100 * 70)   -> out of 100
 * subjectGrade   = letter grade derived from subjectTotal
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Subject {

    @NotBlank(message = "Subject name is required")
    private String subjectName;

    @NotBlank(message = "Subject code is required")
    private String subjectCode;

    @NotNull(message = "MSE marks are required")
    @DecimalMin(value = "0.0", message = "MSE marks cannot be negative")
    @DecimalMax(value = "50.0", message = "MSE marks cannot exceed 50")
    private Double mseMarks;

    @NotNull(message = "ESE marks are required")
    @DecimalMin(value = "0.0", message = "ESE marks cannot be negative")
    @DecimalMax(value = "100.0", message = "ESE marks cannot exceed 100")
    private Double eseMarks;

    // ---- Computed / derived fields (set by the service layer) ----
    private Double mseWeighted;   // out of 30
    private Double eseWeighted;   // out of 70
    private Double subjectTotal;  // out of 100
    private String subjectGrade;  // letter grade
    private Boolean subjectPass;  // pass/fail for this subject
}
