package com.iawes.backend.config;

import com.iawes.backend.entity.Assignment;
import com.iawes.backend.entity.Department;
import com.iawes.backend.entity.RubricCriteria;
import com.iawes.backend.entity.User;
import com.iawes.backend.entity.enums.AssignmentStatus;
import com.iawes.backend.entity.enums.Role;
import com.iawes.backend.repository.AssignmentRepository;
import com.iawes.backend.repository.DepartmentRepository;
import com.iawes.backend.repository.RubricCriteriaRepository;
import com.iawes.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {
    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;
    private final AssignmentRepository assignmentRepository;
    private final RubricCriteriaRepository rubricCriteriaRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        Department cs = departmentRepository.findByNameIgnoreCase("Computer Science")
                .orElseGet(() -> departmentRepository.save(Department.builder().name("Computer Science").build()));
        departmentRepository.findByNameIgnoreCase("Administration")
                .orElseGet(() -> departmentRepository.save(Department.builder().name("Administration").build()));

        User superAdmin = seedUser("System Admin", "super@iawes.com", "admin123", Role.ROLE_SUPER_ADMIN, "Administration");
        User teacher = seedUser("Dr. Sarah Lee", "teacher@iawes.com", "teacher123", Role.ROLE_TEACHER, "Computer Science");
        seedUser("Ava Johnson", "student@iawes.com", "student123", Role.ROLE_STUDENT, "Computer Science");
        seedUser("TA Mike", "ta@iawes.com", "ta123", Role.ROLE_TA, "Computer Science");

        if (assignmentRepository.count() == 0) {
            Assignment a = assignmentRepository.save(Assignment.builder()
                    .title("Data Structures Performance Study")
                    .description("Analyze and compare AVL Trees, Red-Black Trees, and Hash Tables.")
                    .subject("Data Structures")
                    .deadline(LocalDateTime.now().plusDays(7))
                    .maxMarks(100)
                    .createdBy(teacher)
                    .status(AssignmentStatus.PUBLISHED)
                    .referenceFiles(List.of("ds-guidelines.pdf"))
                    .build());
            rubricCriteriaRepository.saveAll(List.of(
                    RubricCriteria.builder().assignment(a).criteriaName("Problem Understanding").maxMarks(25).build(),
                    RubricCriteria.builder().assignment(a).criteriaName("Implementation Quality").maxMarks(45).build(),
                    RubricCriteria.builder().assignment(a).criteriaName("Report & Conclusion").maxMarks(30).build()
            ));
        }
    }

    private User seedUser(String name, String email, String rawPassword, Role role, String departmentName) {
        return userRepository.findByEmailIgnoreCase(email).orElseGet(() -> {
            Department dep = departmentRepository.findByNameIgnoreCase(departmentName)
                    .orElseGet(() -> departmentRepository.save(Department.builder().name(departmentName).build()));
            return userRepository.save(User.builder()
                    .name(name)
                    .email(email)
                    .password(passwordEncoder.encode(rawPassword))
                    .role(role)
                    .department(dep)
                    .build());
        });
    }
}
