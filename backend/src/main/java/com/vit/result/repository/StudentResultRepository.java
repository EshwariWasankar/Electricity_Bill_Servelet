package com.vit.result.repository;

import com.vit.result.model.StudentResult;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StudentResultRepository extends MongoRepository<StudentResult, String> {

    Optional<StudentResult> findByRegistrationNumberIgnoreCase(String registrationNumber);

    boolean existsByRegistrationNumberIgnoreCaseAndSemester(String registrationNumber, String semester);
}
