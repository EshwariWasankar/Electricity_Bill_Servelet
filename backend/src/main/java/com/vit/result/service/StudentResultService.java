package com.vit.result.service;

import com.vit.result.exception.DuplicateResourceException;
import com.vit.result.exception.ResourceNotFoundException;
import com.vit.result.model.StudentResult;
import com.vit.result.model.Subject;
import com.vit.result.repository.StudentResultRepository;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Core business logic for computing a semester result.
 *
 * Marking scheme (as required by the assignment):
 *  - MSE (Mid Semester Exam) is out of 50 marks and contributes 30% of the subject total.
 *  - ESE (End Semester Exam) is out of 100 marks and contributes 70% of the subject total.
 *
 *  mseWeighted  = (mseMarks / 50.0)  * 30
 *  eseWeighted  = (eseMarks / 100.0) * 70
 *  subjectTotal = mseWeighted + eseWeighted        (out of 100)
 *
 *  A subject is a PASS when subjectTotal >= 40.
 *  Overall percentage = average of the 4 subjectTotals.
 *  SGPA (10 point scale) = percentage / 9.5 (standard conversion), capped at 10.
 *  The student's overall result is PASS only if every subject individually passes.
 */
@Service
public class StudentResultService {

    private static final double MSE_MAX = 50.0;
    private static final double ESE_MAX = 100.0;
    private static final double MSE_WEIGHT = 30.0;
    private static final double ESE_WEIGHT = 70.0;
    private static final double PASS_THRESHOLD = 40.0;

    private final StudentResultRepository repository;

    public StudentResultService(StudentResultRepository repository) {
        this.repository = repository;
    }

    public StudentResult createResult(StudentResult incoming) {
        if (repository.existsByRegistrationNumberIgnoreCaseAndSemester(
                incoming.getRegistrationNumber(), incoming.getSemester())) {
            throw new DuplicateResourceException(
                    "A result for registration number '" + incoming.getRegistrationNumber() +
                            "' already exists for semester '" + incoming.getSemester() + "'");
        }
        computeResult(incoming);
        return repository.save(incoming);
    }

    public List<StudentResult> getAllResults() {
        return repository.findAll();
    }

    public StudentResult getResultById(String id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("No result found with id: " + id));
    }

    public StudentResult getResultByRegistrationNumber(String registrationNumber) {
        return repository.findByRegistrationNumberIgnoreCase(registrationNumber)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "No result found for registration number: " + registrationNumber));
    }

    public StudentResult updateResult(String id, StudentResult incoming) {
        StudentResult existing = getResultById(id);
        existing.setStudentName(incoming.getStudentName());
        existing.setRegistrationNumber(incoming.getRegistrationNumber());
        existing.setBranch(incoming.getBranch());
        existing.setSemester(incoming.getSemester());
        existing.setSubjects(incoming.getSubjects());
        computeResult(existing);
        return repository.save(existing);
    }

    public void deleteResult(String id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("No result found with id: " + id);
        }
        repository.deleteById(id);
    }

    /**
     * Runs the full calculation pipeline and mutates the given StudentResult
     * (and its embedded subjects) in place with all derived fields.
     */
    private void computeResult(StudentResult result) {
        List<Subject> subjects = result.getSubjects();
        double totalOfSubjectTotals = 0.0;
        boolean allSubjectsPassed = true;

        for (Subject subject : subjects) {
            double mseWeighted = round((subject.getMseMarks() / MSE_MAX) * MSE_WEIGHT);
            double eseWeighted = round((subject.getEseMarks() / ESE_MAX) * ESE_WEIGHT);
            double subjectTotal = round(mseWeighted + eseWeighted);
            boolean subjectPass = subjectTotal >= PASS_THRESHOLD;

            subject.setMseWeighted(mseWeighted);
            subject.setEseWeighted(eseWeighted);
            subject.setSubjectTotal(subjectTotal);
            subject.setSubjectGrade(gradeFor(subjectTotal));
            subject.setSubjectPass(subjectPass);

            totalOfSubjectTotals += subjectTotal;
            if (!subjectPass) {
                allSubjectsPassed = false;
            }
        }

        double percentage = round(totalOfSubjectTotals / subjects.size());
        double sgpa = round(Math.min(percentage / 9.5, 10.0));

        result.setTotalMarks(round(totalOfSubjectTotals));
        result.setPercentage(percentage);
        result.setSgpa(sgpa);
        result.setOverallGrade(gradeFor(percentage));
        result.setOverallResult(allSubjectsPassed ? "PASS" : "FAIL");
    }

    private String gradeFor(double marks) {
        if (marks >= 90) return "O (Outstanding)";
        if (marks >= 80) return "A+ (Excellent)";
        if (marks >= 70) return "A (Very Good)";
        if (marks >= 60) return "B+ (Good)";
        if (marks >= 50) return "B (Above Average)";
        if (marks >= 45) return "C (Average)";
        if (marks >= 40) return "D (Pass)";
        return "F (Fail)";
    }

    private double round(double value) {
        return Math.round(value * 100.0) / 100.0;
    }
}
