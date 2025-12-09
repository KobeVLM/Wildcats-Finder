package com.wildcatsfinder.wildcats_finder.service;

import com.wildcatsfinder.wildcats_finder.entity.DepartmentEntity;
import com.wildcatsfinder.wildcats_finder.repository.DepartmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

@Service
public class DepartmentService {

    @Autowired
    private DepartmentRepository departmentRepository;

    // CREATE: Add a new department
    public DepartmentEntity createDepartment(DepartmentEntity department) {
        return departmentRepository.save(department);
    }

    // READ: Fetch all departments
    public List<DepartmentEntity> getAllDepartments() {
        return departmentRepository.findAll();
    }

    // READ: Fetch a department by its ID
    public DepartmentEntity getDepartmentById(Long id) {
        Optional<DepartmentEntity> department = departmentRepository.findById(id);
        if (department.isPresent()) {
            return department.get();
        } else {
            throw new NoSuchElementException("Department " + id + " not found");
        }
    }

    // READ: Fetch a department by its name
    public DepartmentEntity getDepartmentByName(String depName) {
        List<DepartmentEntity> departments = departmentRepository.findAll();

        // Loop through each department and check if the name matches
        for (DepartmentEntity department : departments) {
            if (department.getDepName().equals(depName)) {
                return department; // Found a match, return it immediately
            }
        }

        // No match was found
        throw new NoSuchElementException("Department with name '" + depName + "' not found");
    }

    // READ: Fetch departments by location
    public List<DepartmentEntity> getDepartmentsByLocation(String location) {
        List<DepartmentEntity> departments = departmentRepository.findAll();
        List<DepartmentEntity> matchingDepartments = new ArrayList<>();

        // Loop through each department and check if location matches
        for (DepartmentEntity department : departments) {
            if (department.getLocation() != null && department.getLocation().equals(location)) {
                matchingDepartments.add(department);
            }
        }

        return matchingDepartments;
    }

    // CHECK: Verify if department name already exists
    public boolean isDepartmentNameExists(String depName) {
        List<DepartmentEntity> departments = departmentRepository.findAll();

        // Loop through each department and check if the name matches
        for (DepartmentEntity department : departments) {
            if (department.getDepName().equals(depName)) {
                return true; // Found a match, so return true immediately
            }
        }

        // No match was found
        return false;
    }

    // SEARCH: Find departments by name containing search term
    public List<DepartmentEntity> searchDepartmentsByName(String searchTerm) {
        List<DepartmentEntity> departments = departmentRepository.findAll();
        List<DepartmentEntity> matchingDepartments = new ArrayList<>();

        // Loop through each department and check if name contains search term
        for (DepartmentEntity department : departments) {
            if (department.getDepName().toLowerCase().contains(searchTerm.toLowerCase())) {
                matchingDepartments.add(department);
            }
        }

        return matchingDepartments;
    }

    // SEARCH: Find departments by location containing search term
    public List<DepartmentEntity> searchDepartmentsByLocation(String searchTerm) {
        List<DepartmentEntity> departments = departmentRepository.findAll();
        List<DepartmentEntity> matchingDepartments = new ArrayList<>();

        // Loop through each department and check if location contains search term
        for (DepartmentEntity department : departments) {
            if (department.getLocation() != null &&
                    department.getLocation().toLowerCase().contains(searchTerm.toLowerCase())) {
                matchingDepartments.add(department);
            }
        }

        return matchingDepartments;
    }

    // UPDATE: Modify an existing department
    public DepartmentEntity updateDepartment(Long id, DepartmentEntity departmentDetails) {
        // Beginner-friendly version: check Optional explicitly and assign to a variable
        DepartmentEntity department;
        Optional<DepartmentEntity> optionalDept = departmentRepository.findById(id);
        if (optionalDept.isPresent()) {
            department = optionalDept.get();
        } else {
            throw new NoSuchElementException("Department " + id + " not found");
        }

        // Update department fields
        department.setDepName(departmentDetails.getDepName());
        department.setLocation(departmentDetails.getLocation());

        return departmentRepository.save(department);
    }

    // DELETE: Remove a department
    public String deleteDepartment(Long id) {
        if (departmentRepository.findById(id).isPresent()) {
            departmentRepository.deleteById(id);
            return "Department " + id + " is successfully deleted!";
        } else {
            return "Department " + id + " does not exist.";
        }
    }
}