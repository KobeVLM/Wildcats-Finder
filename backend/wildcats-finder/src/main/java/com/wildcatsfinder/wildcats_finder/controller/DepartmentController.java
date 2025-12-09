package com.wildcatsfinder.wildcats_finder.controller;

import com.wildcatsfinder.wildcats_finder.entity.DepartmentEntity;
import com.wildcatsfinder.wildcats_finder.service.DepartmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/departments")
@CrossOrigin(origins = "*") // For React frontend
public class DepartmentController {

    @Autowired
    private DepartmentService departmentService;

    // READ: Get all departments for dropdown selection
    // GET /api/departments
    @GetMapping
    public ResponseEntity<List<DepartmentEntity>> getAllDepartments() {
        try {
            List<DepartmentEntity> departments = departmentService.getAllDepartments();
            return ResponseEntity.ok(departments);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    // READ: Get department by ID
    // GET /api/departments/{id}
    @GetMapping("/{id}")
    public ResponseEntity<?> getDepartmentById(@PathVariable Long id) {
        try {
            DepartmentEntity department = departmentService.getDepartmentById(id);
            return ResponseEntity.ok(department);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Department not found: " + e.getMessage());
        }
    }

    // CREATE: Add new department (admin functionality)
    // POST /api/departments
    @PostMapping
    public ResponseEntity<?> createDepartment(@RequestBody DepartmentEntity department) {
        try {
            // Check if department name already exists
            if (departmentService.isDepartmentNameExists(department.getDepName())) {
                return ResponseEntity.badRequest()
                        .body("Department name already exists: " + department.getDepName());
            }

            DepartmentEntity savedDepartment = departmentService.createDepartment(department);
            return ResponseEntity.ok(savedDepartment);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error creating department: " + e.getMessage());
        }
    }

    // UPDATE: Update department (admin functionality)
    // PUT /api/departments/{id}
    @PutMapping("/{id}")
    public ResponseEntity<?> updateDepartment(@PathVariable Long id, @RequestBody DepartmentEntity departmentDetails) {
        try {
            DepartmentEntity updatedDepartment = departmentService.updateDepartment(id, departmentDetails);
            return ResponseEntity.ok(updatedDepartment);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Error updating department: " + e.getMessage());
        }
    }

    // DELETE: Delete department (admin functionality)
    // DELETE /api/departments/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDepartment(@PathVariable Long id) {
        try {
            String result = departmentService.deleteDepartment(id);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Error deleting department: " + e.getMessage());
        }
    }

    // READ: Get departments by location
    // GET /api/departments/location/{location}
    @GetMapping("/location/{location}")
    public ResponseEntity<List<DepartmentEntity>> getDepartmentsByLocation(@PathVariable String location) {
        try {
            List<DepartmentEntity> departments = departmentService.getDepartmentsByLocation(location);
            return ResponseEntity.ok(departments);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    // SEARCH: Search departments by name or location
    // GET /api/departments/search?name={name}&location={location}
    @GetMapping("/search")
    public ResponseEntity<List<DepartmentEntity>> searchDepartments(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String location) {
        try {
            List<DepartmentEntity> departments;

            if (name != null && !name.trim().isEmpty()) {
                departments = departmentService.searchDepartmentsByName(name);
            } else if (location != null && !location.trim().isEmpty()) {
                departments = departmentService.searchDepartmentsByLocation(location);
            } else {
                departments = departmentService.getAllDepartments();
            }

            return ResponseEntity.ok(departments);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
}